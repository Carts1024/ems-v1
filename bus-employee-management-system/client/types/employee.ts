// types/employee.ts

export interface WorkExperience {
  companyName: string;
  position: string;
  from: string;
  to: string;
  description: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  endDate: string;
}

export interface GovernmentID {
  id?: string;
  idType: string;
  idNumber: string;
  issuedDate: string;
  expiryDate: string;
  status: string;
}

export interface Deduction {
  id?: number;
  reason: string;
  frequency: string;
  type: 'fixed' | 'percentage';
  amount: string;
  effectiveDate: string;
  endDate: string;
  status: string;
}

export interface Benefit {
  id?: number;
  benefit: string;
  frequency: string;
  amount: string;
  effectiveDate: string;
  endDate: string;
  status: string;
}

// The Employee type
export interface Employee {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthdate: string;
  email: string;
  contact: string;
  houseStreet: string;
  barangay: string;
  city: string;
  stateProvinceRegion: string;
  country: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactNo: string;
  status: string;
  dateHired: string;
  employeeType: string;
  employeeClassification: string;
  department: string;
  position: string;
  basicRate: string;
  govtIdType: string;
  govtIdNo: string;
  licenseType: string;
  licenseNo: string;
  restrictionCodes: string[];
  expireDate: string;

  // Arrays
  workExperiences: WorkExperience[];
  educationList: Education[];
  governmentIdList: GovernmentID[];
  benefitList: Benefit[];
  deductionList: Deduction[];
}
