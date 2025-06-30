import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import InputMask from "react-input-mask";
import { createPatient } from "../../services/patient-service";
import "./patient-register.css";

export default function PatientRegister() {
  const [form] = Form.useForm();
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    form.setFieldsValue({ number: "" });
  }, [form]);

  const onFinish = async (values) => {
    const payload = {
      ...values,
      cpf: values.cpf.replace(/\D/g, ""),
      cep: values.cep.replace(/\D/g, ""),
      fatherAge: values.fatherAge || null,
      motherAge: values.motherAge || null,
      type: "PACIENTE",
    };
    try {
      await createPatient(payload);
      message.success("Paciente cadastrado com sucesso!");
      form.resetFields();
      navigate("/patients");
    } catch {
      message.error(
        "Erro ao cadastrar paciente. Verifique os dados e tente novamente."
      );
    }
  };

  const handleCepBlur = async () => {
    const cep = form.getFieldValue("cep").replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          form.setFieldsValue({
            city: data.localidade,
            neighborhood: data.bairro,
            street: data.logradouro,
          });
        }
      } catch {
        message.warning(
          "Não foi possível buscar o endereço para o CEP informado."
        );
      }
    }
  };

  return (
    <div className="patient-register-container">
      <Sidebar/>
      <h2>Cadastro de Paciente</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 800, margin: "0 auto" }}
      >
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nome"
              name="name"
              rules={[{ required: true, message: "Informe o nome" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                { required: true, type: "email", message: "Informe um e-mail válido" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="CPF"
              name="cpf"
              rules={[{ required: true, message: "Informe o CPF" }]}
            >
              <InputMask mask="999.999.999-99" maskChar={null}>
                {(inputProps) => <Input {...inputProps} />}
              </InputMask>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Telefone"
              name="phone"
              rules={[{ required: true, message: "Informe o telefone" }]}
            >
              <InputMask mask="(99) 99999-9999" maskChar={null}>
                {(inputProps) => <Input {...inputProps} maxLength={15} />}
              </InputMask>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Contato de Emergência"
              name="emergencyContact"
              rules={[{ required: true, message: "Informe o contato de emergência" }]}
            >
              <InputMask mask="(99) 99999-9999" maskChar={null}>
                {(inputProps) => <Input {...inputProps} maxLength={15} />}
              </InputMask>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="CEP"
              name="cep"
              rules={[{ required: true, message: "Informe o CEP" }]}
            >
              <InputMask
                mask="99999-999"
                maskChar={null}
                onBlur={handleCepBlur}
              >
                {(inputProps) => <Input {...inputProps} />}
              </InputMask>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Cidade"
              name="city"
              rules={[{ required: true, message: "Informe a cidade" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Bairro"
              name="neighborhood"
              rules={[{ required: true, message: "Informe o bairro" }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} align="middle">
          <Col span={10}>
            <Form.Item
              label="Rua"
              name="street"
              rules={[{ required: true, message: "Informe a rua" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Número da Casa"
              name="number"
              rules={[{ required: true, message: "Informe o número" }]}            >
                <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
              <Button onClick={() => setModalVisible(true)}>Dados dos Pais</Button>
          </Col>
        </Row>
        <Form.Item style={{ marginTop: 20 }}>
          <Button type="primary" htmlType="submit" block>
            Cadastrar
          </Button>
        </Form.Item>
      </Form>

      <Modal
        visible={isModalVisible}
        centered
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={() => setModalVisible(false)}>Cancelar</Button>
            <Button type="primary" onClick={() => setModalVisible(false)}>Salvar</Button>
          </div>
        }
      >
        <Form form={form} span={30} layout="vertical">
          <h3>Dados do Pai</h3>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Nome do Pai" name="fatherName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Educação do Pai" name="fatherEducation">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Idade do Pai" name="fatherAge">
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Local de Trabalho do Pai"
                name="fatherWorkplace">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Profissão do Pai"
                name="fatherProfession">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <h3>Dados da Mãe</h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Nome da Mãe" name="motherName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Educação da Mãe" name="motherEducation">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Idade da Mãe" name="motherAge">
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Local de Trabalho da Mãe" name="motherWorkplace">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Profissão da Mãe" name="motherProfession">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}