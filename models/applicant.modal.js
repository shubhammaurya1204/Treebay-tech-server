import mongoose from "mongoose";

const { Schema } = mongoose;

// 🔹 Academic Schema (Multiple Entries)
const academicSchema = new Schema({
    educationLevel: {
        type: String,
        enum: ["10th", "12th", "Diploma", "Graduation", "Post Graduation", "PhD"],
        required: true,
    },
    degree: {
        type: String,
        required: true
    },
    specialization: {
        type: String
    },
    institutionName: {
        type: String,
        required: true
    },
    boardOrUniversity: {
        type: String,
        required: true
    },
    startYear: {
        type: Number,
        required: true
    },
    endYear: {
        type: Number,
        required: true,
    },
    percentageOrCGPA: {
        type: Number,
        required: true,
    },
    backlogs: {
        hasBacklogs: {
            type: Boolean,
            default: false
        },
        count: {
            type: Number,
            default: 0
        },
    },
    mode: {
        type: String,
        enum: ["Regular", "Distance"],
        default: "Regular",
    },
});

// 🔹 Work Experience Schema
const experienceSchema = new Schema({
    companyName: String,
    jobTitle: String,
    employmentType: {
        type: String,
        enum: ["Full-time", "Intern", "Contract"],
    },
    startDate: Date,
    endDate: Date,
    currentlyWorking: { type: Boolean, default: false },
    currentSalary: Number,
    expectedSalary: Number,
    noticePeriod: String,
    jobDescription: String,
    skillsUsed: [String],
});

// 🔹 Project Schema
const projectSchema = new Schema({
    title: String,
    description: String,
    technologies: [String],
    githubLink: String,
    liveLink: String,
});

// 🔹 Main Applicant Schema
const applicantSchema = new Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },
        // 🧑‍💼 Personal Details
        personalDetails: {
            fullName: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
            },
            mobile: {
                type: String,
                required: true
            },
            alternatePhone: String,
            dob: Date,
            gender: String,
            nationality: String,

            address: {
                currentAddress: String,
                permanentAddress: String,
                city: String,
                state: String,
                country: String,
                pincode: String,
            },

            profilePhoto: String,

            linkedin: String,
            portfolio: String,
            github: String,
        },

        // 🎓 Academics
        academics: [academicSchema],

        // 💼 Experience
        isFresher: { type: Boolean, default: true },
        experiences: [experienceSchema],

        // 🛠️ Skills & Projects
        skills: {
            technical: [String],
            soft: [String],
        },
        projects: [projectSchema],

        // 📄 Documents
        documents: {
            resume: { type: String, required: true },
            coverLetter: String,
            certificates: [String],
        },

        // 🌍 Other Details
        otherDetails: {
            willingToRelocate: Boolean,
            preferredLocation: String,
            workAuthorization: String,
            openToShift: Boolean,
            expectedJoiningDate: Date,
            appliedBefore: Boolean,
            relativesInCompany: Boolean,
        },

        // 👀 Preview (optional tracking)
        completionPercentage: {
            type: Number,
            default: 0,
        },

        // ✅ Declaration
        declaration: {
            isTrue: { type: Boolean, required: true },
            acceptedPrivacyPolicy: Boolean,
            acceptedTerms: Boolean,
            digitalSignature: String,
            submittedAt: Date,
        },

        // 🚀 Status (for admin panel)
        applicationStatus: {
            type: String,
            enum: ["Draft", "Submitted", "Under Review", "Rejected", "Selected"],
            default: "Draft",
        },
    },
    { timestamps: true }
);

// Compound unique index — same email can apply to different jobs, but not the same job twice
applicantSchema.index({ "personalDetails.email": 1, jobId: 1 }, { unique: true });

export default mongoose.model("Applicant", applicantSchema);
