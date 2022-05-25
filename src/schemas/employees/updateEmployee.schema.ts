import * as yup from "yup";
import { normalizeTextInput } from "../../utils";

const updateEmployeeSchema = yup.object().shape({
  name: yup
    .string()
    .max(164, "Field name cannot be longer than 164 characters")
    .transform((value) => normalizeTextInput(value)),
  phone: yup
    .string()
    .min(11, "Field phone cannot be shorter than 11 characters")
    .max(15, "Field phone cannot be longer than 15 characters"),
  email: yup
    .string()
    .email("Field email is invalid")
    .max(164, "Field email cannot be longer than 164 characters")
    .transform((value) => normalizeTextInput(value)),
  password: yup
    .string()
    .min(8, "Field password cannot be shorter than 8 characters"),
  accessLevel: yup
    .number()
    .min(2, "Field accessLevel must be between 2 and 5 inclusive")
    .max(5, "Field accessLevel must be between 2 and 5 inclusive"),
});

export default updateEmployeeSchema;
