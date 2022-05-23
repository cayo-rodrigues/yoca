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
          .max(64, "Field name has a max length of 64 characters")
          .required("Field name is required"),
      }),
    },
  },
};

export default createEmployeeSchema;
