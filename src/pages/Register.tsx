import React from 'react';
import {
  Form, Input, Button, Card, Typography, message, DatePicker, Steps, Divider,
} from 'antd';
import {
  UserOutlined, LockOutlined, MailOutlined, PhoneOutlined,
  IdcardOutlined, ArrowRightOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { api } from '../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const result = await api.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
        dob: values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : '',
        idCard: values.idCard,
      });

      if ('error' in result) {
        message.error(result.error);
      } else {
        dispatch(login(result));
        message.success('Đăng ký tài khoản thành công!');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #003087 0%, #0050b3 50%, #1677ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Card
        style={{ width: '100%', maxWidth: 520, borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64, height: 64, background: '#003087', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 28, color: '#faad14', fontWeight: 'bold',
            }}
          >
            TS
          </div>
          <Title level={3} style={{ margin: 0, color: '#003087' }}>Tạo tài khoản</Title>
          <Text type="secondary">Điền đầy đủ thông tin để đăng ký</Text>
        </div>

        <Form form={form} onFinish={handleSubmit} layout="vertical" size="large">
          <Form.Item name="fullName" label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item name="dob" label="Ngày sinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
              disabledDate={(d) => d && d > dayjs().subtract(15, 'year')}
            />
          </Form.Item>

          <Form.Item name="idCard" label="Số CCCD/CMND"
            rules={[
              { required: true, message: 'Vui lòng nhập số CCCD!' },
              { pattern: /^\d{9,12}$/, message: 'Số CCCD không hợp lệ (9-12 chữ số)!' },
            ]}>
            <Input prefix={<IdcardOutlined />} placeholder="0012XXXXXXXX" />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^(0|\+84)\d{9}$/, message: 'Số điện thoại không hợp lệ!' },
            ]}>
            <Input prefix={<PhoneOutlined />} placeholder="09XXXXXXXX" />
          </Form.Item>

          <Form.Item name="email" label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}>
            <Input prefix={<MailOutlined />} placeholder="example@gmail.com" />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu ít nhất 6 ký tự!' },
            ]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Tối thiểu 6 ký tự" />
          </Form.Item>

          <Form.Item name="confirmPassword" label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button type="primary" htmlType="submit" block loading={loading}
              icon={<CheckCircleOutlined />}
              style={{ height: 44, background: '#003087', borderColor: '#003087', fontSize: 15 }}>
              Đăng ký tài khoản
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>
          <Text type="secondary" style={{ fontSize: 13 }}>Đã có tài khoản?</Text>
        </Divider>
        <Button block size="large" onClick={() => navigate('/login')}
          style={{ height: 44, borderColor: '#003087', color: '#003087' }}>
          Đăng nhập ngay
        </Button>
      </Card>
    </div>
  );
};

export default Register;