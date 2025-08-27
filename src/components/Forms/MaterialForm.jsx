import { Input, Button, Form, Space, Select, Card, Switch, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import proveedorService from '../../services/proveedorService';

const { Option } = Select;

const MaterialForm = ({ saveMaterial, editData, clearForm, isEditting, isSaveSucces }) => {
    const [form] = Form.useForm();

    const [proveedores, setProveedores] = useState([]);
    const [proveedoresAgregar, setProveedoresAgregar] = useState([]);
    const [proveedoresEliminar, setProveedoresEliminar] = useState([]);

    const getProveedores = async () => {
        const response = await proveedorService.getAll();
        if (response.status === 200) {
            setProveedores(response.data);
        } else {
            console.error('Error al obtener proveedores:', response.data);
        }
    };

    // Función para agregar un proveedor al estado de proveedores seleccionados
    const selectChange = (value) => {
        const proveedorExistente = proveedoresAgregar.find(prov => prov.id_proveedor === value);
        if (proveedorExistente) return; // Evita duplicados

        const proveedorInfo = proveedores.find(prov => prov.id === value);
        if (proveedorInfo) {
            const nuevoProveedor = { id_proveedor: value, costo: 0, autorizado: false, nombre: proveedorInfo.nombre };
            setProveedoresAgregar([...proveedoresAgregar, nuevoProveedor]);
            //console.log(nuevoProveedor)
        }
    };

    // Función para eliminar un proveedor del estado
    const removeProveedor = (id) => {
        const nuevosProveedores = proveedoresAgregar.filter(prov => prov.id_proveedor !== id);
        setProveedoresAgregar(nuevosProveedores);
        // También puedes guardar el proveedor eliminado en otro estado si necesitas enviarlo al backend
        const proveedorEliminado = proveedoresAgregar.find(prov => prov.id_proveedor === id);
        if (proveedorEliminado) {
            setProveedoresEliminar([...proveedoresEliminar, proveedorEliminado]);
        }
    };

    // Función para actualizar los datos de un proveedor (costo o autorización)
    const handleProveedorChange = (id, field, value) => {
        const nuevosProveedores = proveedoresAgregar.map(prov => {
            if (prov.id_proveedor === id) {
                return { ...prov, [field]: value };
            }
            return prov;
        });
        //console.log(nuevosProveedores)
        setProveedoresAgregar(nuevosProveedores);
    };

    useEffect(() => {
        if (editData) {
            form.setFieldsValue(editData);
            if (editData.proveedores) {
                // Objeto final
                // {id_proveedor, nombre, costo, autorizado}

                // Objeto recibido
                // {provedores: [autorizado, costo, proveedor: {nombre}]} 

                const proveedoresAux = editData.proveedores.map(data => ({
                    id_proveedor: data.proveedor.id,
                    nombre: data.proveedor.nombre,
                    autorizado: data.autorizado,
                    costo: data.costo
                }));

                setProveedoresAgregar(proveedoresAux);

                const idsProveedoresAsociados = proveedoresAux.map(prov => prov.id_proveedor);
                
                const proveedoresParaSelect = proveedores.filter(prov => !idsProveedoresAsociados.includes(prov.id));
                setProveedores(proveedoresParaSelect);
            }
        } else {
            form.resetFields();
            setProveedoresAgregar([]);
            setProveedoresEliminar([]);
        }
    }, [editData, form]);

    useEffect(() => {
        if (isSaveSucces) {
            form.resetFields();
            setProveedoresAgregar([]);
            setProveedoresEliminar([]);
            setProveedores([]);
            getProveedores();
        }
    }, [isSaveSucces, form]);

    useEffect(() => {
        getProveedores();
    }, []);

    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                const dataToSend = {
                    ...values,
                    proveedores: proveedoresAgregar,
                    proveedoresEliminar: proveedoresEliminar
                };
                saveMaterial(dataToSend);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        getProveedores();
        clearForm()
    }

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
                    rules={[{ required: true, message: 'Por favor ingresa el nombre del material' },
                    { max: 50, message: 'El nombre no debe exceder los 50 caracteres' }
                    ]}
                >
                    <Input placeholder="Nombre del material" />
                </Form.Item>
                <Form.Item
                    label="Código"
                    name="codigo"
                    rules={[{ required: true, message: 'Por favor ingresa el código del material' },
                    { max: 50, message: 'El código no debe exceder los 50 caracteres' },
                    ]}
                >
                    <Input placeholder="Código del material" />
                </Form.Item>
                <Form.Item
                    label="Unidad de medida"
                    name="unidad_medida"
                    rules={[{ required: true, message: 'Por favor ingresa la unidad de medida' },
                    { max: 50, message: 'La unidad de medida no debe de exceder los 50 caracteres' },
                    ]}
                >
                    <Input placeholder="Unidad de medida" />
                </Form.Item>
                <Form.Item
                    label="Descripción"
                    name="descripcion"
                    rules={[
                        { required: true, message: 'Por favor ingresa una descripción' },
                        { max: 200, message: 'La descripción no puede exceder los 200 caracteres' }
                    ]}
                >
                    <Input placeholder="Descripción" />
                </Form.Item>

                <Form.Item name="select" label="Proveedores" rules={[{ required: false }]}>
                    <Select
                        placeholder="Seleccione un proveedor"
                        onChange={selectChange}
                        value={null} // Limpia el valor seleccionado en el Select
                        allowClear
                    >
                        {
                            proveedores.map((prov) => (
                                <Option key={prov.id} value={prov.id}>{prov.nombre}</Option>
                            ))
                        }
                    </Select>
                </Form.Item>

                {/* Renderizado dinámico de proveedores seleccionados */}
                <Space direction="vertical" style={{ width: '100%' }}>
                    {proveedoresAgregar.map((prov) => (
                        <Card
                            key={prov.id_proveedor}
                            title={prov.nombre}
                            extra={<Button danger onClick={() => removeProveedor(prov.id_proveedor)}>Eliminar</Button>}
                            style={{ marginTop: 16 }}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Costo"
                                        name={['proveedoresAgregar', prov.id_proveedor, 'costo']}
                                        initialValue={prov.costo}
                                        rules={[{ required: true, message: 'Ingrese el costo' }]}
                                    >
                                        <Input
                                            type="number"
                                            placeholder="Costo"
                                            onChange={(e) => handleProveedorChange(prov.id_proveedor, 'costo', e.target.value)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Autorizado"
                                        name={['proveedoresAgregar', prov.id_proveedor, 'autorizado']}
                                        valuePropName="checked"
                                        initialValue={prov.autorizado}
                                    >
                                        <Switch
                                            onChange={(checked) => handleProveedorChange(prov.id_proveedor, 'autorizado', checked)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Space>

                <Form.Item style={{ marginTop: 24 }}>
                    <Space>
                        <Button type="primary" onClick={handleSubmit}>
                            {isEditting ? 'Actualizar Material' : 'Agregar Material'}
                        </Button>
                        {isEditting && (
                            <Button onClick={handleCancel}>
                                Cancelar
                            </Button>
                        )}
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
}

export default MaterialForm;