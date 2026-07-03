export class CreateInsuranceEnquiryDto {
  fullName: string;
  mobileNumber: string;
  email?: string;
  city: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  registrationNumber: string;
  manufacturingYear: number;
  previousPolicyProvider?: string;
  insuranceType?: string;
  policyExpiryDate?: string;
  claimHistory?: string;
  additionalNotes?: string;
}
