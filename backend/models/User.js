import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    isSuspended: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    kycStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    twoFA: {
      enabled: { type: Boolean, default: false },
      secret: { type: String, default: null },
    },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Indexes
// UserSchema.index({ email: 1 });
// UserSchema.index({ referralCode: 1 });

// Password helpers
UserSchema.methods.setPassword = async function (plain) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(plain, salt);
};

UserSchema.methods.validatePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Referral code generation (simple but collision-resistant approach)
UserSchema.statics.generateReferralCode = function (length = 8) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

// Ensure referralCode exists before save
UserSchema.pre("save", async function () {
  if (!this.referralCode) {
    let code;
    let tries = 0;
    do {
      code = this.constructor.generateReferralCode(8);
      // check uniqueness
      // eslint-disable-next-line no-await-in-loop
      const exists = await this.constructor
        .findOne({ referralCode: code })
        .lean();
      if (!exists) {
        this.referralCode = code;
        break;
      }
      tries += 1;
    } while (tries < 5);
    if (!this.referralCode)
      this.referralCode = `${Date.now().toString(36).slice(-6)}${Math.floor(
        Math.random() * 1000
      )}`;
  }
});

const User = mongoose.model("User", UserSchema);

export default User;
