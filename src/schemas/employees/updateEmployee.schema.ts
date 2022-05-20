import * as yup from "yup";

const updateEmployeeSchema = {
  schema: {
    user: {
      yupSchema: yup.object().shape({
        id: yup.string().uuid().required(),
      }),
    },
    body: {
      yupSchema: yup.object().shape({
        name: yup.string().max(164).optional(),
        phone: yup.string().min(11).max(15).optional(),
        email: yup.string().email().max(164).optional(),
        password: yup.string().min(8).optional(),
        accessLevel: yup.number().min(2).max(5).optional(),
      }),
    },
  },
};

export default updateEmployeeSchema;
