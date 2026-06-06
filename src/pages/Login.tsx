import React from 'react';
import {
  Form, Input, Button, Card, Typography, message, Divider, Space,
} from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { api } from '../services/api';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await api.login(values.email, values.password);
      if (result) {
        dispatch(login(result));
        message.success('Đăng nhập thành công!');
        navigate('/dashboard');
      } else {
        message.error('Email hoặc mật khẩu không đúng!');
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
        style={{ width: '100%', maxWidth: 420, borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        bodyStyle={{ padding: '40px 40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: '#003087',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 28,
              color: '#faad14',
              fontWeight: 'bold',
            }}
          >
            TS
          </div>
          <Title level={3} style={{ margin: 0, color: '#003087' }}>
            Đăng nhập
          </Title>
          <Text type="secondary">Hệ thống Tuyển sinh Đại học Trực tuyến</Text>
        </div>

        <Form form={form} onFinish={handleSubmit} layout="vertical" size="large">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập địa chỉ email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              icon={<LoginOutlined />}
              style={{ height: 44, background: '#003087', borderColor: '#003087', fontSize: 15 }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Chưa có tài khoản?
          </Text>
        </Divider>

        <Button block size="large" onClick={() => navigate('/register')}
          style={{ height: 44, borderColor: '#003087', color: '#003087' }}>
          Tạo tài khoản mới
        </Button>

        <div
          style={{
            marginTop: 20,
            padding: '10px 14px',
            background: '#fffbe6',
            border: '1px solid #ffe58f',
            borderRadius: 8,
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            <strong>Demo:</strong> test@gmail.com / 123456
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;