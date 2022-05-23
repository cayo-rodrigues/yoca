import * as yup from "yup";

const createEmployeeSchema = {
  schema: {
    user: {
      yupSchema: yup.object().shape({
        id: yup.string().uuid("Invalid uuid").required("Field id is required"),
      }),
    },
    body: {
      yupSchema: yup.object().shape({
        name: yup
          .string()
          .max(164, "Field name has a max length of 164 characters")
          .optional(),
        phone: yup
          .string()
          .min(11, "Field phone has a minimum length of 11 charactes")
          .max(15, "Field phone has a max length of 15 characters")
          .optional(),
        email: yup
          .string()
          .email("Invalid email")
          .max(164, "Field phone has a max length of 164 charactes")
          .optional(),
        password: yup
          .string()
          .min(8, "Field password must be at least eight characters long")
          .optional(),
        accessLevel: yup
          .number()
          .min(2, "Access level must be between 2 and 5 inclusive")
          .max(5, "Access level must be between 2 and 5 inclusive")
          .optional(),
      }),
    },
  },
};

export default createEmployeeSchema;
