import * as yup from "yup";
import { normalizeTextInput } from "../../utils";

const validateLoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Field email is invalid")
    .required("Field email is required")
    .transform(normalizeTextInput),
  password: yup.string().required("Field password is required"),
});

export default validateLoginSchema;
