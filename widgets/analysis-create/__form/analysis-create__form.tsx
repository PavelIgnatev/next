import React from "react";
import { AutoComplete, Button, Form, Input, Select } from "antd";
import { RuleObject } from "antd/es/form";

const { TextArea } = Input;
const { Option } = Select;

import classes from "./analysis-create__form.module.css";

interface AnalysisCreateFormProps {
  loading?: boolean;

  onFinish: (data: {
    aiRole: string;
    companyName: string;
    companyDescription: string;
    goal: string;
    language: string;
  }) => void;
  onFinishFailed: () => void;
}

const rules = [
  {
    required: true,
    message: "Обязательное поле!",
  },
  {
    min: 25,
    message: "Минимальная длина 25 символов",
  },
];

export const AnalysisCreateForm = (props: AnalysisCreateFormProps) => {
  const { loading = false, onFinish, onFinishFailed } = props;

  return (
    <Form
      name="basic"
      layout="vertical"
      className={classes.analysisCreateForm}
      onFinish={onFinish}
      initialValues={{ language: "РУССКИЙ" }}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Название компании"
        name="companyName"
        rules={[rules[0]]}
      >
        <AutoComplete maxLength={25} />
      </Form.Item>
      <Form.Item label="Роль AI менеджера" name="aiRole" rules={rules}>
        <TextArea style={{ height: 80, resize: "none" }} maxLength={100} />
      </Form.Item>
      <Form.Item
        label="Описание компании"
        name="companyDescription"
        rules={rules}
      >
        <TextArea style={{ height: 80, resize: "none" }} maxLength={1000} />
      </Form.Item>
      <Form.Item label="Целевое действие" name="goal" rules={[...rules]}>
        <TextArea style={{ height: 80, resize: "none" }} maxLength={1000} />
      </Form.Item>
      <Form.Item label="Язык разбора" name="language" rules={[rules[0]]}>
        <Select defaultValue="РУССКИЙ">
          <Option value="РУССКИЙ">РУССКИЙ</Option>
          <Option value="АНГЛИЙСКИЙ">АНГЛИЙСКИЙ</Option>
        </Select>
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          style={{ marginTop: "1em" }}
          size="large"
          loading={loading}
        >
          {!loading ? "Создать разбор" : "Создание разбора"}
        </Button>
      </Form.Item>
    </Form>
  );
};
