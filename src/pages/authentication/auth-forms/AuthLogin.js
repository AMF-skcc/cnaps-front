import React, { useState } from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';

// material-ui
import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormHelperText,
    Grid,
    Link,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';

// project import패
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

//============ test ============
import { Admin, Member } from 'mock/testExample';
import { login } from 'utils/authHandler';
import { ADMIN_TYPE, MEMBER_TYPE } from 'utils/constant';

import { loginForMember, loginForAdmin } from 'api/authentication'

const AuthLogin = () => {

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

    const [checked, setChecked] = React.useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const adminLogin = async (values) => {
        try{
            const admin = await loginForAdmin(values);
            login({
                ...admin,
                type: ADMIN_TYPE
            });
            enqueueSnackbar("로그인에 성공하였습니다.",{variant: 'success'});
            navigate(`/`);
        }
        catch (e){
            console.log("error:", e);
            enqueueSnackbar("로그인에 실패하였습니다.",{variant: 'error'});
        }
        // if (Admin.email === values.email && Admin.password === values.password) {
        //     login({
        //         ...Admin,
        //         type: ADMIN_TYPE
        //     });
        // }
    };
    const memberLogin = async (values) => {

        try{
            const member = await loginForMember(values);
            login({
                ...member,
                type: MEMBER_TYPE
            });
            enqueueSnackbar("로그인에 성공하였습니다.",{variant: 'success'});
            navigate(`/`);
        }
        catch (e){
            console.log("error:", e);
            enqueueSnackbar("로그인에 실패하였습니다.",{variant: 'error'});
        }

        // if (Member.email === values.email && Member.password === values.password) {
        //     login({
        //         ...Member,
        //         type: MEMBER_TYPE
        //     });
        // }
    };

    const accessSuccess = async (values) => {
        if (checked) {
            await adminLogin(values);
        } else {
            await memberLogin(values);
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setStatus({ success: false });
                        setSubmitting(true);
                        accessSuccess(values);
                    } catch (err) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-login">이메일</InputLabel>
                                    <OutlinedInput
                                        id="email-login"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="이메일을 입력하세요"
                                        fullWidth
                                        error={Boolean(touched.email && errors.email)}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-login">비밀번호</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="-password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="비밀번호를 입력하세요"
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={12} sx={{ mt: -1 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checked}
                                                onChange={(event) => setChecked(event.target.checked)}
                                                name="checked"
                                                color="primary"
                                                size="small"
                                            />
                                        }
                                        label={<Typography variant="h6">관리자</Typography>}
                                    />
                                </Stack>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        로그인
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthLogin;