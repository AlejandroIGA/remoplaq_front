import SideBar from "../../components/SideBar"
import Layout from "../../components/Layout/Layout"
import { useState, useEffect } from "react"
import { Table, Button, message, App, Input, Radio } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ProveedorForm from "../../components/Forms/ProveedorForm";
import proveedorService from "../../services/proveedorService";

const Proveedores = () => {
    const { modal } = App.useApp(); // Use the App hook instead of Modal.confirm

    const provedoresAux = [
        {id:1, nombre: "Proveedor 1", telefono: "123456789", correo: "proveedor@gmail.com"}
    ]

    const [proveedores, setProveedores] = useState(provedoresAux);
    const [editData, setEditData] = useState(null);
    const [isEditting, setIsEditting] = useState(false)
    const [busqueda, setBusqueda] = useState("");
    const [filtro, setFiltro] = useState("nombre");

    const [messageApi, contextHolder] = message.useMessage();
    
    const getProveedores = async() => {
        const response = await proveedorService.getAll();
        if(response.status === 200){
            setProveedores(response.data);
        }else{
            messageApi.error(response.data);
        }
    }

    const editRecord = async (id) => {
        const response = await proveedorService.getById(id);
        console.log(response);
        if(response.status === 200){
            setEditData(response.data);
            setIsEditting(true);
        }else{
            messageApi.error(response.data);
        }
    };

    const save = async (data) => {
        if(isEditting){
            const response = await proveedorService.update(editData.id, data);
            if(response.status === 200){
                messageApi.success("Proveedor actualizado correctamente");
                getProveedores();
                clearForm();
            }else{
                messageApi.error(response.data);
            }
        }else{
            const response = await proveedorService.save(data);
            if(response.status === 200){
                messageApi.success("Proveedor creado correctamente");
                getProveedores();
                clearForm();
            }else{
                messageApi.error(response.data);
            }
        }
    }

    const deleteRecord = (id, nombre) => {
        modal.confirm({
            title: '¿Estás seguro?',
            content: (
                <div>
                    <p>¿Deseas eliminar al proveedor <strong>"{nombre}"</strong>?</p>
                    <p style={{ color: '#666', fontSize: '14px' }}>Esta acción no se puede deshacer.</p>
                </div>
            ),
            okText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            okType: 'danger',
            width: 400,
            async onOk() {
                const response = await proveedorService.delete(id)
                if(response.status === 204){
                    messageApi.success("Proveedor eliminado correctamente");
                    getProveedores();
                }
                else if(response.status === 404){
                    messageApi.error("El proveedor no existe o ya fue eliminado");
                    getProveedores();
                }else{
                    messageApi.error(response.data);
                }
            },
            onCancel() {
                messageApi.info('Acción cancelada');
            },
        });
    };

    const handleSearch = async () => {
        if(busqueda.trim() === ""){
            getProveedores();
            return;
        }
        
        const response = await proveedorService.search(busqueda, filtro);

        if(response.status === 200 && response.data.length !== 0){
            setProveedores(response.data);
        }else if(response.data.length == 0){
            messageApi.info("No se encontraron resultados");
            setProveedores([]);
        }
        else{
            messageApi.error(response.data);
        }
    }

    const clearForm = () => {
        setEditData(null);
        setIsEditting(false);
    }

    const columnas = [
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
        { title: 'Telefono', dataIndex: 'telefono', key: 'telefono' },
        { title: 'Correo', dataIndex: 'correo', key: 'correo' },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 200,
            render: (text, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button 
                        onClick={() => editRecord(record.id)} 
                        className="boton-editar" 
                        icon={<EditOutlined />}
                        size="small"
                    >
                        Editar
                    </Button>
                    <Button 
                        onClick={() => deleteRecord(record.id, record.nombre)} 
                        icon={<DeleteOutlined />}
                        size="small"
                        className="boton-eliminar"
                    >
                        Eliminar
                    </Button>
                </div>
            )
        }
    ];

    useEffect(()=>{
        getProveedores();
    },[])

    return (
        <Layout
            aside = {<SideBar/>}
            main = {
                <div>
                    {contextHolder}
                    <div>
                        <h2>Proveedores</h2>
                    </div>
                    <div>
                        <div>

                        </div>
                        <div>
                            <div style={{ marginBottom: '20px' }}>
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
                    <Radio value="telefono">Teléfono</Radio>
                    <Radio value="correo">Correo</Radio>
                </Radio.Group>
            </div>
                            <ProveedorForm onSubmit={save} editData={editData} isEditting={isEditting} clearForm={clearForm}/>
                             <Table columns={columnas} dataSource={proveedores} rowKey="id" pagination={{pageSize:10}} />
                        </div>
                    </div>
                </div>
            }
        />
    )
} 

export default Proveedores;