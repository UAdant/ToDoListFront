import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const registerSchema = Yup.object().shape({
  username: Yup.string().required('Обов’язкове поле'),
  email: Yup.string().email('Неправильний формат email').required('Обов’язкове поле'),
  password: Yup.string()
    .min(8, 'Пароль має містити мінімум 8 символів')
    .matches(/[0-9]/, 'Пароль має містити хоча б одну цифру')
    .matches(/[a-zA-Z]/, 'Пароль має містити хоча б одну літеру')
    .matches(/[\W_]/, 'Пароль повинен містити хоча б один спеціальний символ.')
    .required('Обов’язкове поле'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Паролі повинні збігатися')
    .required('Підтвердження пароля обов’язкове'),
});

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [timer, setTimer] = useState(180); // Таймер на 3 хвилини

  useEffect(() => {
    if (isRegistered && timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }

    if (timer === 0) {
      navigate('/login');
    }
  }, [isRegistered, timer, navigate]);

  const handleRegister = async (values, { setFieldError }) => {
    try {
      const response = await fetch('http://localhost:8000/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
          confirm_password: values.confirm_password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors.username) {
          setFieldError('username', errorData.errors.username);
        }
        if (errorData.errors.email) {
          setFieldError('email', errorData.errors.email);
        }
      } else {
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Помилка під час реєстрації:', error);
      alert('Помилка під час реєстрації');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-gray-300">
        {isRegistered ? (
          <div className="text-center">
            <p className="text-gray-700 mb-6">
              На вашу пошту надіслано лист. Перейдіть за посиланням, щоб підтвердити вашу електронну адресу.
            </p>
            <div className="text-gray-700 font-semibold">
              Переадресація на сторінку авторизації через {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
            </div>
          </div>
        ) : (
          <Formik
            initialValues={{ username: '', email: '', password: '', confirm_password: '' }}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div className="relative">
                  <label className="block text-gray-700">Ім'я користувача</label>
                  <div className="flex items-center border border-gray-300 rounded focus:ring focus:ring-blue-200">
                    <AiOutlineUser className="text-gray-600 ml-3" size={20} />
                    <Field
                      type="text"
                      name="username"
                      className="w-full p-2 pl-8 focus:outline-none"
                      placeholder="Введіть ваше ім'я користувача"
                    />
                  </div>
                  <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="relative">
                  <label className="block text-gray-700">Email</label>
                  <div className="flex items-center border border-gray-300 rounded focus:ring focus:ring-blue-200">
                    <AiOutlineMail className="text-gray-600 ml-3" size={20} />
                    <Field
                      type="email"
                      name="email"
                      className="w-full p-2 pl-8 focus:outline-none"
                      placeholder="Введіть ваш email"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="relative">
                  <label className="block text-gray-700">Пароль</label>
                  <div className="flex items-center border border-gray-300 rounded focus:ring focus:ring-blue-200">
                    <AiOutlineLock className="text-gray-600 ml-3" size={20} />
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="w-full p-2 pl-8 focus:outline-none"
                      placeholder="Введіть ваш пароль"
                    />
                    <button
                      type="button"
                      className="absolute right-3 mt-1"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="relative">
                  <label className="block text-gray-700">Підтвердження пароля</label>
                  <div className="flex items-center border border-gray-300 rounded focus:ring focus:ring-blue-200">
                    <AiOutlineLock className="text-gray-600 ml-3" size={20} />
                    <Field
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm_password"
                      className="w-full p-2 pl-8 focus:outline-none"
                      placeholder="Повторно введіть ваш пароль"
                    />
                    <button
                      type="button"
                      className="absolute right-3 mt-1"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage name="confirm_password" component="div" className="text-red-500 text-sm" />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Зачекайте...' : 'Зареєструватися'}
                </button>
                <div className="text-center mt-4">
                <span>Обліковий запис є? </span>
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-500 hover:underline"
                >
                  Увійти
                </button>
              </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}
