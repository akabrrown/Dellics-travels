export class SendCodeDto {
  email: string;
  name?: string;
}

export class VerifyCodeDto {
  email: string;
  code: string;
}

export class StudentSignupDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  code?: string;
}

export class StudentLoginDto {
  email: string;
  password?: string;
  code?: string;
}

export class StudentOnboardingDto {
  email: string;
  profile: any;
}

export class CreatePastQuestionDto {
  exam: string;
  title: string;
  year?: number;
  file_url: string;
  resource_type?: string;
  is_active?: boolean;
}

export class UpdatePastQuestionDto {
  exam?: string;
  title?: string;
  year?: number;
  file_url?: string;
  resource_type?: string;
  is_active?: boolean;
}

export class CreateStudentTestDto {
  test_type: string;
  status?: string;
  test_date?: string;
  score?: string;
  notes?: string;
  email?: string;
}

export class UpdateStudentTestDto {
  test_type?: string;
  status?: string;
  test_date?: string;
  score?: string;
  notes?: string;
  email?: string;
}

