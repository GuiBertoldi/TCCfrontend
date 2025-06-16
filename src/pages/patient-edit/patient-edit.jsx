import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, message, Collapse } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import InputMask from "react-input-mask";
import { fetchPatientById, updatePatient } from "../../services/patient-service";
import "./patient-edit.css";

const { Panel } = Collapse;

export default function PatientEdit() {
  const { idUser } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!idUser) return;
    setLoading(true);
    fetchPatientById(idUser)
      .then((data) => {
        const u = data.idUser || {};
        const flat = {
          idPatient: data.idPatient ?? "",
          name: data.name ?? u.name ?? "",
          email: data.email ?? u.email ?? "",
          cpf: data.cpf ?? u.cpf ?? "",
          phone: data.phone ?? u.phone ?? "",
          emergencyContact: data.emergencyContact ?? u.emergencyContact ?? "",
          cep: data.cep ?? u.cep ?? "",
          city: data.city ?? u.city ?? "",
          neighborhood: data.neighborhood ?? u.neighborhood ?? "",
          street: data.street ?? u.street ?? "",
          number: data.number ?? u.number ?? "",
          complement: data.complement ?? u.complement ?? "",
          fatherName: data.fatherName ?? u.fatherName ?? "",
          fatherEducation: data.fatherEducation ?? u.fatherEducation ?? "",
          fatherAge: data.fatherAge != null ? String(data.fatherAge) : "",
          fatherWorkplace: data.fatherWorkplace ?? u.fatherWorkplace ?? "",
          fatherProfession: data.fatherProfession ?? u.fatherProfession ?? "",
          motherName: data.motherName ?? u.motherName ?? "",
          motherEducation: data.motherEducation ?? u.motherEducation ?? "",
          motherAge: data.motherAge != null ? String(data.motherAge) : "",
          motherWorkplace: data.motherWorkplace ?? u.motherWorkplace ?? "",
          motherProfession: data.motherProfession ?? u.motherProfession ?? "",
        };
        form.setFieldsValue(flat);
      })
      .catch(() => message.error("Não foi possível carregar os dados"))
      .finally(() => setLoading(false));
  }, [idUser, form]);

  const onFinish = async (values) => {
    setLoading(true);
    const payload = {
      ...values,
      cpf: values.cpf.replace(/\D/g, ""),
      cep: values.cep.replace(/\D/g, ""),
      fatherAge: values.fatherAge ? Number(values.fatherAge) : null,
      motherAge: values.motherAge ? Number(values.motherAge) : null,
      type: "PACIENTE",
    };
    try {
      await updatePatient(values.idPatient, payload);
      message.success("Paciente atualizado com sucesso!");
      navigate("/patients");
    } catch {
      message.error("Erro ao salvar alterações. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleCepBlur = async () => {
    const cep = form.getFieldValue("cep")?.replace(/\D/g, "");
    if (cep && cep.length === 8) {
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
        message.warning("Não foi possível buscar o endereço para o CEP informado.");
      }
    }
  };

  return (
    <div className="patient-register-container">
      <Sidebar />
      <div className="patient-register-content">
        <h2>Editar Paciente</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: 800, margin: "0 auto" }}
          disabled={loading}
          initialValues={{ fatherAge: "", motherAge: "" }}
        >
          <Form.Item name="idPatient" noStyle>
            <Input type="hidden" />
          </Form.Item>

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
                rules={[{ required: true, type: "email", message: "Informe um e-mail válido" }]}
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
            <Col span={6}>
              <Form.Item
                label="CEP"
                name="cep"
                rules={[{ required: true, message: "Informe o CEP" }]}
              >
                <InputMask mask="99999-999" maskChar={null} onBlur={handleCepBlur}>
                  {(inputProps) => <Input {...inputProps} />}
                </InputMask>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Cidade"
                name="city"
                rules={[{ required: true, message: "Informe a cidade" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Bairro"
                name="neighborhood"
                rules={[{ required: true, message: "Informe o bairro" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Rua"
                name="street"
                rules={[{ required: true, message: "Informe a rua" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Número da Casa"
                name="number"
                rules={[{ required: true, message: "Informe o número" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item label="Complemento" name="complement">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Collapse>
            <Panel header="Dados do Pai" key="father">
              <Row gutter={16}>
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
                  <Form.Item label="Local de Trabalho do Pai" name="fatherWorkplace">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Profissão do Pai" name="fatherProfession">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
          </Collapse>

          <Collapse style={{ marginTop: 20 }}>
            <Panel header="Dados da Mãe" key="mother">
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
                  <Form.Item label="Local de Trabalho da Mãe" name="motherWorkplace">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Profissão da Mãe" name="motherProfession">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
          </Collapse>

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
