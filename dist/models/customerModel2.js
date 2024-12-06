'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importStar(require('mongoose'));
const customerSchema = new mongoose_1.Schema(
  {
    name: {
      type: String,
      required: true,
      default: function () {
        return this.email; // ใช้ค่า email เป็นค่า default สำหรับ name
      },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile_phone: { type: String, default: null },
    date_of_birth: { type: Date, default: null },
    creator_id: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      default: function () {
        return this._id; // ใช้ค่า _id ของเอกสาร Customer เอง
      },
    },
    last_op_id: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      default: function () {
        return this._id; // ใช้ค่า _id ของเอกสาร Customer เอง
      },
    },
    tram_status: { type: Boolean, default: true },
  },
  {
    timestamps: {
      createdAt: 'create_timestamp',
      updatedAt: 'last_updated_timestamp',
    },
  }
);
exports.default = mongoose_1.default.model('Customer', customerSchema);
