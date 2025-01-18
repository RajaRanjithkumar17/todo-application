import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { triggerNotification } from "../../components/toaster/ToastBar";
import "./Dashboard.css"
import { Button, Table } from "antd";
import SearchInput from "../../components/SearchField";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../task/modal/DeleteConfirmationModal";

interface TodoItem {
  id: string;
  title: string;
  status: "todo" | "inProgress" | "done";
  dueDate: string;
  description: string;
  assignedUser: number;
  priority: "low" | "high";
  tags: string[];
}

const Dashboard = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const [toDoList, setToDoList] = useState([]);
  const [list, setList] = useState([]);

  const [loader, setLoader] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [taskID, setTaskID] = useState<string>("");


  const navigate = useNavigate()


  useEffect(() => {
    getTodoList();
  }, []);
  
  const tableColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a:any, b:any) => a.title.localeCompare(b.title), 

    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (data: any) => (
          <p className={`${data?.toLowerCase()} capitalize font-Inter `}>
           {data}
          </p>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a:any, b:any) => a.dueDate.localeCompare(b.dueDate), 
    },
    {
      title: 'Assigned User',
      dataIndex: 'assignedUser',
      key: 'assignedUser',
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
        render: (data: any) => (
          <p className="text-[14px] flex items-center text-[#d34a7c]">
            <span className="material-symbols-outlined text-[20px] p-1 cursor-pointer" onClick={()=>{handleView(data)}}>visibility</span>
            <span className="material-symbols-outlined text-[20px] p-1 cursor-pointer" onClick={()=>{handleEdit(data)}}>edit</span>
            <span className="material-symbols-outlined text-[20px] p-1 cursor-pointer" onClick={()=>{handleDelete(data)}}>delete</span>
          </p>
      ),
    },
  ];

  const handleView = (id:string)=>{
    debugger
  }

  const handleEdit = (id:string)=>{
    navigate(`/tasks/${id}?isEdit=true`);
  }

  const handleDelete = (id:string)=>{
    setTaskID(id)
    setIsDelete(true)
  }

  const handlePopupModalClose = () =>{
    setIsDelete(false)

  }

  const getTodoList = async () => {
    try {
      const response = await axios.get(`${baseUrl}/todo`);
      if (response.status === 200) {
        setToDoList(response.data);
        setList(response.data);
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      triggerNotification("error", "", "Error while fetching data", "topRight");
    }
  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event?.target?.value;
    setSearch(searchValue);
    setLoader(true)
    debouncedGetFilterData(searchValue);
  };

  const debouncedGetFilterData = useCallback(
    debounce((searchValue) => {
      const filtered = list.filter((item:TodoItem) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setToDoList(filtered);
      setLoader(false)
    }, 800),
    [list]
  );

  const handleCreateTask = () =>{
    navigate('/tasks')
  }

  return (
    <div className="full-width-container">
      <div className="dashboard">
        <div className="flex w-full justify-between items-center mb-5">
       <p className="page-title font-Inter w-1/2 p-0">Todo List</p>
       <div className="flex w-1/2 justify-end">
       <SearchInput search={search} placeholder={'search by task title'} onChange={handleSearch} />
       <Button type="primary" onClick={handleCreateTask} >Create <span className="material-symbols-outlined" >add</span></Button>
       </div>

        </div>
       <Table loading={loader} columns={tableColumns } dataSource={toDoList} />
      </div>

      {isDelete && <DeleteConfirmationModal open={isDelete} taskID={taskID} handlePopupModalClose={handlePopupModalClose} />}

  </div>
  )
};

export default Dashboard;
