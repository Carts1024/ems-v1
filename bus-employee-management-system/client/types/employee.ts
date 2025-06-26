// types/employee.ts

export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  from: string;
  to: string;
  description: string;
}

export interface Education {
  id?: string;
  institute: string;
  degree: string;
  specialization: string;
  completionDate: string;
}

export interface GovernmentID {
  idType: string;
  idNumber: string;
  issuedDate: string;
  expiryDate: string;
  status: string;
}

export interface Deduction {
  reason: string;
  frequency: string;
  type: 'fixed' | 'percentage';
  amount: string;
  effectiveDate: string;
  endDate: string;
  status: string;
}

export interface Benefit {
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
