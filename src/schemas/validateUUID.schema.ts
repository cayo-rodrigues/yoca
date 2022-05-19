import * as yup from "yup";

const validateUUIDSchema = {
  schema: {
    params: {
      yupSchema: yup.object().shape({
        id: yup.string().required("id param is required").uuid("invalid id"),
      }),
      validateOptions: {
        abortEarly: false,
      },
    },
  },
};

export default validateUUIDSchema;
