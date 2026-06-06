import React, { useState } from 'react';
import { Upload, Button, List, Tag, Typography, message, Space } from 'antd';
import {
  UploadOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface Props {
  value?: UploadedFile[];
  onChange?: (files: UploadedFile[]) => void;
  maxCount?: number;
  label?: string;
}

const UploadFile: React.FC<Props> = ({
  value = [],
  onChange,
  maxCount = 5,
  label = 'Tải lên tài liệu',
}) => {
  const [files, setFiles] = useState<UploadedFile[]>(value);

  const handleUpload = (file: File) => {
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      message.error('Chỉ chấp nhận file PDF, JPG, PNG!');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error('File không được vượt quá 5MB!');
      return false;
    }
    if (files.length >= maxCount) {
      message.error(`Chỉ được tải lên tối đa ${maxCount} file!`);
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile: UploadedFile = {
        name: file.name,
        url: e.target?.result as string,
        type: file.type,
        size: file.size,
      };
      const updated = [...files, newFile];
      setFiles(updated);
      onChange?.(updated);
      message.success(`${file.name} đã được tải lên!`);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange?.(updated);
  };

  const handlePreview = (file: UploadedFile) => {
    const win = window.open();
    if (win) {
      if (file.type === 'application/pdf') {
        win.document.write(
          `<iframe src="${file.url}" width="100%" height="100%" style="border:none"></iframe>`
        );
      } else {
        win.document.write(`<img src="${file.url}" style="max-width:100%" />`);
      }
    }
  };

  return (
    <div>
      <Upload
        accept=".pdf,.jpg,.jpeg,.png"
        showUploadList={false}
        beforeUpload={handleUpload}
        multiple
      >
        <Button icon={<UploadOutlined />} disabled={files.length >= maxCount}>
          {label} ({files.length}/{maxCount})
        </Button>
      </Upload>
      <Text type="secondary" style={{ display: 'block', marginTop: 4, fontSize: 12 }}>
        Chấp nhận: PDF, JPG, PNG • Tối đa 5MB/file
      </Text>

      {files.length > 0 && (
        <List
          style={{ marginTop: 12 }}
          size="small"
          dataSource={files}
          renderItem={(file, index) => (
            <List.Item
              style={{
                background: '#fafafa',
                borderRadius: 6,
                marginBottom: 4,
                padding: '6px 12px',
                border: '1px solid #f0f0f0',
              }}
              actions={[
                <Button
                  key="preview"
                  type="link"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => handlePreview(file)}
                >
                  Xem
                </Button>,
                <Button
                  key="remove"
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(index)}
                >
                  Xóa
                </Button>,
              ]}
            >
              <Space>
                {file.type === 'application/pdf' ? (
                  <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
                ) : (
                  <FileImageOutlined style={{ color: '#1677ff', fontSize: 18 }} />
                )}
                <div>
                  <Text style={{ fontSize: 13 }}>{file.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </Text>
                </div>
                <Tag color={file.type === 'application/pdf' ? 'red' : 'blue'}>
                  {file.type === 'application/pdf' ? 'PDF' : 'Ảnh'}
                </Tag>
              </Space>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default UploadFile;