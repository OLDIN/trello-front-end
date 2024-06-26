import * as yup from 'yup';

const schema = yup.object().shape({
  firstName: yup.string().required().min(2).max(50),
  lastName: yup.string().required().min(2).max(50),
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
  avatar: yup.mixed<FileList>().required(),
});

export default schema;
