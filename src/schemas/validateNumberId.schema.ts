import * as yup from "yup";

const validateNumberIdSchema = {
  schema: {
    params: {
      yupSchema: yup.object().shape({
        id: yup
          .number()
          .integer("id param must be an integer")
          .required("id param is required")
          .positive("id must be a positive number"),
      }),
      validateOptions: {
        abortEarly: false,
      },
    },
  },
};

export default validateNumberIdSchema;
