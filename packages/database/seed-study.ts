import { PrismaClient, StudyApplicationStage, StudyApplicationStatus, StudyDocumentStatus, StudyTestStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Consultant CRM mock data...');

  const s1 = await prisma.studyApplication.create({
    data: {
      applicant_name: 'John Doe',
      applicant_email: 'john@example.com',
      applicant_phone: '+233 24 123 4567',
      city: 'Accra',
      destination: 'United Kingdom',
      course: 'MSc Data Science',
      intake: 'Sept 2026',
      stage: StudyApplicationStage.DOCUMENT_COLLATION,
      status: StudyApplicationStatus.IN_PROGRESS,
      visa_status: 'Not Started',
      documents: {
        create: [
          { name: 'Passport Scan', file_url: 'john_passport.pdf', status: StudyDocumentStatus.APPROVED },
          { name: 'Undergraduate Transcript', file_url: 'transcript_final.pdf', status: StudyDocumentStatus.PENDING },
        ],
      },
      tests: {
        create: [
          { test_type: 'IELTS Academic', status: StudyTestStatus.PREP_ARRANGED, notes: 'Target score: 7.0 band' },
        ],
      },
      notes: {
        create: [
          { author_name: 'Kwame Asante', text: 'Student prefers universities in London or Manchester.' },
        ],
      },
    },
  });

  const s2 = await prisma.studyApplication.create({
    data: {
      applicant_name: 'Ama Serwaa',
      applicant_email: 'ama.s@example.com',
      applicant_phone: '+233 20 987 6543',
      city: 'Kumasi',
      destination: 'Canada',
      course: 'BSc Nursing',
      intake: 'Jan 2027',
      stage: StudyApplicationStage.OFFER_RECEIVED,
      status: StudyApplicationStatus.ACTION_REQUIRED,
      visa_status: 'Document Collation',
      documents: {
        create: [
          { name: 'WASSCE Certificate', file_url: 'wassce_ama.pdf', status: StudyDocumentStatus.APPROVED },
          { name: 'Financial Statement', file_url: 'bank_statement.pdf', status: StudyDocumentStatus.REJECTED },
        ],
      },
      tests: {
        create: [
          { test_type: 'IELTS General', status: StudyTestStatus.COMPLETED, score: '7.5', notes: 'Met minimum requirements.' },
        ],
      },
      notes: {
        create: [
          { author_name: 'Kwame Asante', text: 'Needs to resubmit bank statements with correct date range.' },
        ],
      },
    },
  });

  const s3 = await prisma.studyApplication.create({
    data: {
      applicant_name: 'Kwasi Mensah',
      applicant_email: 'kwasi.m@example.com',
      applicant_phone: '+233 55 555 5555',
      city: 'Tema',
      destination: 'United States',
      course: 'MBA',
      intake: 'Sept 2026',
      stage: StudyApplicationStage.VISA_APPLICATION,
      status: StudyApplicationStatus.IN_PROGRESS,
      visa_status: 'Interview Scheduled (Nov 15)',
      documents: {
        create: [
          { name: 'Passport', file_url: 'passport_kwasi.pdf', status: StudyDocumentStatus.APPROVED },
        ],
      },
      tests: {
        create: [
          { test_type: 'GMAT', status: StudyTestStatus.COMPLETED, score: '680', notes: 'Submitted to Stanford.' },
        ],
      },
    },
  });

  const s4 = await prisma.studyApplication.create({
    data: {
      applicant_name: 'Fatima Ali',
      applicant_email: 'fatima@example.com',
      applicant_phone: '+233 27 777 7777',
      city: 'Tamale',
      destination: 'United Kingdom',
      course: 'LLB Law',
      intake: 'Sept 2026',
      stage: StudyApplicationStage.INITIAL_CONSULTATION,
      status: StudyApplicationStatus.IN_PROGRESS,
      visa_status: 'Not Started',
      notes: {
        create: [
          { author_name: 'Sarah Osei', text: 'Awaiting high school final results.' },
        ],
      },
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
