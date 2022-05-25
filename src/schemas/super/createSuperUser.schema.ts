import * as yup from "yup";
import { normalizeTextInput } from "../../utils";

const createEmployeeSchema = yup.object().shape({
  name: yup
    .string()
    .max(164, "Field name cannot be longer than 164 characters")
    .required("Field name is required")
    .transform((value) => normalizeTextInput(value)),
  phone: yup
    .string()
    .min(11, "Field phone cannot be shorter than 11 characters")
    .max(15, "Field phone cannot be longer than 15 characters")
    .required("Field phone is required"),
  email: yup
    .string()
    .email("Field email is invalid")
    .max(164, "Field email cannot be longer than 164 characters")
    .required("Field email is required")
    .transform((value) => normalizeTextInput(value)),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$&*]{8,}$/,
      "Field password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number"
    )
    .required("Field password is required"),
});

export default createEmployeeSchema;
