import React from "react";
import { AutoComplete, Button, Form, Input } from "antd";
import { RuleObject } from "antd/es/form";

const { TextArea } = Input;

import classes from "./analysis-create__form.module.css";

interface AnalysisCreateFormProps {
  loading?: boolean;

  onFinish: (data: {
    aiRole: string;
    companyName: string;
    companyDescription: string;
    goal: string;
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

  const validateGoalRule = (_: RuleObject, value: string) => {
    if (!value || !value.includes("Получить согласие")) {
      return Promise.reject(
        new Error('Фраза "Получить согласие" обязательна!')
      );
    }
    return Promise.resolve();
  };

  return (
    <Form
      name="basic"
      layout="vertical"
      className={classes.analysisCreateForm}
      onFinish={onFinish}
      initialValues={{ goal: "Получить согласие на" }}
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
        <TextArea style={{ height: 80, resize: "none" }} maxLength={300} />
      </Form.Item>
      <Form.Item
        label="Целевое действие"
        name="goal"
        rules={[
          ...rules,
          {
            validator: validateGoalRule,
          },
        ]}
      >
        <TextArea style={{ height: 80, resize: "none" }} maxLength={300} />
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
