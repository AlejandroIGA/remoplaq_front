import { Input, Button, Radio, Table, Typography, Form, ConfigProvider, Modal, Checkbox, Space, Tag } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';

const ProveedorForm = ({onSubmit, editData, clearForm, isEditting}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editData) {
            form.setFieldsValue(editData);
        } else {
            form.resetFields();
        }
    });

    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                onSubmit(values);
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                initialValues={{ nombre: '', telefono: '', correo: '' }}
            >
                <Form.Item
                    label="Nombre"
                    name="nombre"
                    rules={[{ required: true, message: 'Por favor ingresa el nombre del proveedor' }]}
                >
                    <Input placeholder="Nombre del proveedor" />
                </Form.Item>
                <Form.Item
                    label="Teléfono"
                    name="telefono"
                    rules={[{ required: true, message: 'Por favor ingresa el teléfono del proveedor' }]}
                >
                    <Input placeholder="Teléfono del proveedor" />
                </Form.Item>
                <Form.Item
                    label="Correo"
                    name="correo"
                    rules={[
                        { required: true, message: 'Por favor ingresa el correo del proveedor' },
                        { type: 'email', message: 'Por favor ingresa un correo válido' }
                    ]}
                >
                    <Input placeholder="Correo del proveedor" />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" onClick={handleSubmit}>
                            {isEditting ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
                        </Button>
                        {isEditting && (
                            <Button onClick={clearForm}>
                                Cancelar
                            </Button>
                        )}
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}

export default ProveedorForm;