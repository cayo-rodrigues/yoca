import * as yup from "yup";

const createEmployeeSchema = {
  schema: {
    body: {
      yupSchema: yup.object().shape({
        name: yup.string().max(164).required(),
        phone: yup.string().min(11).max(15).required(),
        email: yup.string().email().max(164).required(),
        password: yup.string().min(8).required(),
      }),
    },
  },
};

export default createEmployeeSchema;
