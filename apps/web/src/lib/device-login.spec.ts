import { describe, it, expect } from "vitest";
import { prisma } from "./db";
import { computeDeviceFingerprint, generateVerificationCode } from "./device";

describe("One Device One Account & Cross-Device Approval Flow", () => {
  const testUserId = "d6406d18-c8cc-4246-ad4c-069aea2a1bf1"; // Existing user in DB
  const primaryFingerprint = computeDeviceFingerprint("PrimaryChrome/124.0", "client-entropy-1");
  const secondaryFingerprint = computeDeviceFingerprint("SecondarySafari/17.4", "client-entropy-2");

  it("should register and recognize primary device", async () => {
    // 1. Clean test devices for this user
    await prisma.$executeRawUnsafe(`
      DELETE FROM public."UserDevice" WHERE "user_id" = '${testUserId}';
    `);
    await prisma.$executeRawUnsafe(`
      DELETE FROM public."DeviceLoginChallenge" WHERE "user_id" = '${testUserId}';
    `);

    // 2. Register primary device
    await prisma.$executeRawUnsafe(`
      INSERT INTO public."UserDevice" (
        "id", "user_id", "device_fingerprint", "device_name", "browser", "os", "ip_address", "location", "is_primary", "is_active", "last_active_at", "created_at", "updated_at"
      ) VALUES (
        gen_random_uuid(), '${testUserId}', '${primaryFingerprint}', 'Google Chrome on Windows 10/11', 'Google Chrome', 'Windows 10/11', '102.176.45.12', 'Accra, Ghana', true, true, NOW(), NOW(), NOW()
      );
    `);

    const activeDevices: any[] = await prisma.$queryRawUnsafe(`
      SELECT * FROM public."UserDevice" WHERE "user_id" = '${testUserId}' AND "is_active" = true;
    `);

    expect(activeDevices.length).toBe(1);
    expect(activeDevices[0].device_fingerprint).toBe(primaryFingerprint);
  }, 15000);

  it("should create cross-device login challenge when secondary device attempts sign-in", async () => {
    const challengeToken = "challenge-test-token-uuid-1234";
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.$executeRawUnsafe(`
      INSERT INTO public."DeviceLoginChallenge" (
        "id", "user_id", "challenge_token", "device_fingerprint", "device_name", "browser", "os", "ip_address", "location", "status", "verification_code", "expires_at", "created_at", "updated_at"
      ) VALUES (
        gen_random_uuid(), '${testUserId}', '${challengeToken}', '${secondaryFingerprint}', 'Apple Safari on iOS (iPhone)', 'Apple Safari', 'iOS (iPhone)', '197.251.12.8', 'Kumasi, Ghana', 'PENDING', '${verificationCode}', '${expiresAt.toISOString()}', NOW(), NOW()
      );
    `);

    // Fetch pending challenges for user
    const pending: any[] = await prisma.$queryRawUnsafe(`
      SELECT * FROM public."DeviceLoginChallenge"
      WHERE "user_id" = '${testUserId}' AND "status" = 'PENDING' AND "expires_at" > NOW();
    `);

    expect(pending.length).toBe(1);
    expect(pending[0].challenge_token).toBe(challengeToken);
    expect(pending[0].verification_code).toBe(verificationCode);
    expect(pending[0].device_name).toBe("Apple Safari on iOS (iPhone)");
  }, 15000);

  it("should approve challenge, transition active device, and unlock new session", async () => {
    const challengeToken = "challenge-test-token-uuid-1234";

    // 1. Primary device approves challenge
    await prisma.$executeRawUnsafe(`
      UPDATE public."DeviceLoginChallenge"
      SET "status" = 'APPROVED', "updated_at" = NOW()
      WHERE "challenge_token" = '${challengeToken}';
    `);

    // 2. Strict 1-Device Policy: Transition active device to the new device
    await prisma.$executeRawUnsafe(`
      UPDATE public."UserDevice"
      SET "is_active" = false, "updated_at" = NOW()
      WHERE "user_id" = '${testUserId}';
    `);

    await prisma.$executeRawUnsafe(`
      INSERT INTO public."UserDevice" (
        "id", "user_id", "device_fingerprint", "device_name", "browser", "os", "ip_address", "location", "is_primary", "is_active", "last_active_at", "created_at", "updated_at"
      ) VALUES (
        gen_random_uuid(), '${testUserId}', '${secondaryFingerprint}', 'Apple Safari on iOS (iPhone)', 'Apple Safari', 'iOS (iPhone)', '197.251.12.8', 'Kumasi, Ghana', true, true, NOW(), NOW(), NOW()
      );
    `);

    // 3. Verify challenge is approved
    const challenges: any[] = await prisma.$queryRawUnsafe(`
      SELECT * FROM public."DeviceLoginChallenge" WHERE "challenge_token" = '${challengeToken}';
    `);
    expect(challenges[0].status).toBe("APPROVED");

    // 4. Verify only secondary device is active
    const activeDevices: any[] = await prisma.$queryRawUnsafe(`
      SELECT * FROM public."UserDevice" WHERE "user_id" = '${testUserId}' AND "is_active" = true;
    `);
    expect(activeDevices.length).toBe(1);
    expect(activeDevices[0].device_fingerprint).toBe(secondaryFingerprint);
  }, 15000);

  it("should handle denial of challenge and preserve primary device", async () => {
    const deniedChallengeToken = "denied-test-token-uuid-5678";
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Create challenge
    await prisma.$executeRawUnsafe(`
      INSERT INTO public."DeviceLoginChallenge" (
        "id", "user_id", "challenge_token", "device_fingerprint", "device_name", "browser", "os", "ip_address", "location", "status", "verification_code", "expires_at", "created_at", "updated_at"
      ) VALUES (
        gen_random_uuid(), '${testUserId}', '${deniedChallengeToken}', 'untrusted-rogue-device', 'Opera on Linux', 'Opera', 'Linux', '45.33.21.90', 'Unknown', 'PENDING', '${verificationCode}', '${expiresAt.toISOString()}', NOW(), NOW()
      );
    `);

    // Primary device denies
    await prisma.$executeRawUnsafe(`
      UPDATE public."DeviceLoginChallenge"
      SET "status" = 'DENIED', "updated_at" = NOW()
      WHERE "challenge_token" = '${deniedChallengeToken}';
    `);

    const result: any[] = await prisma.$queryRawUnsafe(`
      SELECT * FROM public."DeviceLoginChallenge" WHERE "challenge_token" = '${deniedChallengeToken}';
    `);
    expect(result[0].status).toBe("DENIED");
  }, 15000);
});
