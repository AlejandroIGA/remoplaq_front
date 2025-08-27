import { useState, useEffect } from "react";
import { Table, Button, message, App, Input, Radio,  } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import MaterialForm from "../../components/Forms/MaterialForm";
import Layout from "../../components/Layout/Layout";
import SideBar from "../../components/SideBar";
import materialService from "../../services/materialService";

const Materiales = () => {
    const { modal } = App.useApp();

    const [materiales, setMateriales] = useState([]);

    const [messageApi, contextHolder] = message.useMessage();

    const [busqueda, setBusqueda] = useState("");
    const [filtro, setFiltro] = useState("nombre");

    const [editData, setEditData] = useState(null);
    const [isEditting, setIsEditting] = useState(false)
    const [isSaveSuccess, setIsSaveSuccess] = useState(false);

    const getMateriales = async () => {
        const response = await materialService.getAll();;
        if (response.status === 200) {
            setMateriales(response.data);
        } else {
            messageApi.error(response.data);
        }
    }

    const saveMaterial = async (data) => {
        
        const materialData = {
            codigo: data.codigo,
            descripcion: data.descripcion,
            nombre: data.nombre,
            unidad_medida: data.unidad_medida,
        }

        const responseMaterial = 
            isEditting == true 
                ? await materialService.edit(editData.id, materialData) 
                : await materialService.save(materialData);

        if (responseMaterial.status == 200) {

            messageApi.success(`Material ${isEditting == true ? "actualizado" : "registrado"} correctamente`);
            const responseRelations = 
                isEditting == true 
                    ? await materialService.editRelations(responseMaterial.data.id, data.proveedores, data.proveedoresEliminar)
                    : await materialService.saveRelations(responseMaterial.data.id, data.proveedores);
            
            if (responseRelations.status === 200) {
                
                messageApi.success(`Relaciones entre material y proveedor ${isEditting == true ? "actualizadas" : "registradas"} correctamente`);

                getMateriales();
                clearForm();
                setIsSaveSuccess(true);

            } else {
                messageApi.error(responseRelations.data);
            }
        }else {
            messageApi.error(responseMaterial.data);
        }

    }

    const editMaterial = async (id) => {
        const response = await materialService.getById(id)
        if (response.status === 200) {
            setEditData(response.data);
            setIsEditting(true);
        } else {
            messageApi.error(response.data);
        }
    }

    const deleteMaterial = async (id, nombre) => {
        modal.confirm({
            title: '¿Estás seguro?',
            content: (
                <div>
                    <p>¿Deseas eliminar el material <strong>"{nombre}"</strong>?</p>
                    <p style={{ color: '#666', fontSize: '14px' }}>Esta acción no se puede deshacer.</p>
                </div>
            ),
            okText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            okType: 'danger',
            width: 400,
            async onOk() {
                const response = await materialService.delete(id)
                if (response.status === 204) {
                    messageApi.success("Material eliminado correctamente");
                    getMateriales();
                }
                else if (response.status === 404) {
                    messageApi.error("El material no existe o ya fue eliminado");
                    getMateriales();
                } else {
                    messageApi.error(response.data);
                }
            },
            onCancel() {
                messageApi.info('Acción cancelada');
            },
        });
    };

    const clearForm = () => {
        setEditData(null);
        setIsEditting(false);
    }

    const columnas = [
            { title: 'Código', dataIndex: 'codigo', key: 'codigo' },
            { title: 'Unidad de medida', dataIndex: 'unidad_medida', key: 'unidad_medida' },
            { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
            { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
            {
                title: 'Acciones',
                key: 'acciones',
                width: 200,
                render: (text, record) => (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            onClick={() => editMaterial(record.id)}
                            className="boton-editar"
                            icon={<EditOutlined />}
                            size="small"
                            disabled = {
                                isEditting == true
                                ? record.id != editData.id ? true : false
                                : false
                            }
                        >
                            Editar
                        </Button>
                        <Button
                            onClick={() => deleteMaterial(record.id, record.nombre)}
                            icon={<DeleteOutlined />}
                            size="small"
                            className="boton-eliminar"
                            disabled = {
                                isEditting == true
                                ? record.id != editData.id ? true : false
                                : false
                            }
                        >
                            Eliminar
                        </Button>
                    </div>
                )
            }
        ];
    
        useEffect(() => {
            getMateriales();
        }, []);
    return (
       <Layout
        main = {
            <div>
                {contextHolder}
                <h2>Materiales</h2>
                <div>
                    <Input.Search
                    placeholder={`Buscar por ${filtro}`}
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                    }}
                    enterButton
                    style={{ marginBottom: '10px' }}
                    onSearch = {()=> handleSearch()}
                />
                <Radio.Group
                    onChange={(e) => {
                        setFiltro(e.target.value);
                    }}
                    value={filtro}
                >
                    <Radio value="nombre">Nombre</Radio>
                    <Radio value="codigo">Código</Radio>
                    <Radio value="proveedor">Proveedor</Radio>
                </Radio.Group>
                </div>
                <div>
                    <MaterialForm saveMaterial={saveMaterial} editData={editData} isEditting={isEditting} clearForm={clearForm} isSaveSucces={isSaveSuccess}></MaterialForm>
                    <Table columns={columnas} dataSource={materiales} rowKey="id" pagination={{ pageSize: 10 }} />
                </div>
                
            </div>
        }
       />
    )
}
export default Materiales;