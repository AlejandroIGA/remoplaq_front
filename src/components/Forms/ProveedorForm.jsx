import { Input, Button, Radio, Table, Typography, Form, ConfigProvider, Modal, Checkbox, Space, Tag } from 'antd';
import { useEffect } from 'react';

const ProveedorForm = ({onSubmit, editData, clearForm, isEditting, isSaveSucces}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editData) {
            form.setFieldsValue(editData);
        } else {
            form.resetFields();
        }
    });

    useEffect(() => {
        if (isSaveSucces) {
            form.resetFields();
        }
    }, [isSaveSucces]);

    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                onSubmit(values);
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
                    rules={[{ required: true, message: 'Por favor ingresa el nombre del proveedor' },
                        {min: 3, message: 'El nombre debe tener al menos 3 caracteres'},
                        {max: 50, message: 'El nombre no debe exceder los 50 caracteres'}
                    ]}
                >
                    <Input placeholder="Nombre del proveedor" />
                </Form.Item>
                <Form.Item
                    label="Teléfono"
                    name="telefono"
                    rules={[{ required: true, message: 'Por favor ingresa el teléfono del proveedor' },
                        {min:10, message: 'El teléfono debe tener al menos 10 caracteres'},
                        {max:10, message: 'El teléfono no debe exceder los 10 caracteres'},
                    ]}
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