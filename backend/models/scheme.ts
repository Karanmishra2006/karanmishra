import mongoose, { Schema, Document } from "mongoose";

export interface IScheme extends Document {
  id: string;
  title: string;
  shortName: string;
  ministry: string;
  category: string;
  sectorType: string;
  benefitHeadline: string;
  maxCeilingText: string;
  description: string;
  statutoryClause: string;
  officialPortalUrl: string;
  objectives: string;
  eligibilityParameters: string[];
  requiredDocuments: string[];

  minAge?: number;
  maxAge?: number;
  allowedOccupations?: string[];
  allowedCategories?: string[];
  allowedGenders?: string[];
  maxIncome?: number;
  maxProjectCost?: number;
}

const schemeSchema = new Schema<IScheme>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    shortName: {
      type: String,
      required: true,
    },

    ministry: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    sectorType: {
      type: String,
      required: true,
    },

    benefitHeadline: {
      type: String,
      required: true,
    },

    maxCeilingText: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    statutoryClause: {
      type: String,
      required: true,
    },

    officialPortalUrl: {
      type: String,
      required: true,
    },

    objectives: {
      type: String,
      required: true,
    },

    eligibilityParameters: {
      type: [String],
      default: [],
    },

    requiredDocuments: {
      type: [String],
      default: [],
    },

    minAge: Number,
    maxAge: Number,
    allowedOccupations: [String],
    allowedCategories: [String],
    allowedGenders: [String],
    maxIncome: Number,
    maxProjectCost: Number,
  },
  {
    timestamps: true,
  }
);

const Scheme = mongoose.model<IScheme>("Scheme", schemeSchema);

export default Scheme;