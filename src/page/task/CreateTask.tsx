import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { triggerNotification } from "../../components/toaster/ToastBar";
import { Button, DatePicker, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import initialValues from "./helper/initialValues";
import validationSchema from "./helper/validationSchema";
import moment from "moment";

const { TextArea } = Input;

interface TodoPayload {
    title: string;
    status: string;
    dueDate: string; 
    description: string;
    assignedUser: number | null; 
    priority: string;
    tags: string[]; 
  }
  
  interface User {
    id: string; 
    name: string;
    email: string;
  }
  
const CreateTask = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const [loader, setLoader] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [initialValue, setInitialValue] = useState<TodoPayload>(initialValues);
  
  const { id } = useParams<{ id: string}>();
  const [searchParams] = useSearchParams();  

  const isEdit = searchParams.get("isEdit") === "true";
  const navigate = useNavigate()

  const statusOptions =[
    {value:'todo',label:'ToDo' },
    {value:'inprogress',label:'InProgress' },
    {value:'done',label:'Done' }
  ]

  const priorityOptions =[
    {value:'low',label:'Low' },
    {value:'high',label:'High' },
  ]


  useEffect(() => {
    getUsersList();
    
    if(id) getSingleToDo()
    
  }, []);

  const getUsersList = async () => {
    try {
      const response = await axios.get(`${baseUrl}/users`);
      if (response.status === 200) {
        setUsersList(response.data);
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      triggerNotification("error", "", "Error while fetching data", "topRight");
    }
  };

  const getSingleToDo = async () => {
    try {
      const response = await axios.get(`${baseUrl}/todo/${id}`);
      if (response.status === 200) {
        response.data.dueDate = moment(response.data.dueDate, "YYYY-MM-DD");
        setInitialValue(response.data)
        setLoader(false)
        console.log(response.data);
          }
    } catch (error) {
      setLoader(false)
      triggerNotification("error", "", "Error while fetching data", "topRight");
    }
  };

    const handleSubmit = async (values: TodoPayload, ) => {
        let response;

        setLoader(true)
        try {
            if (isEdit) {
              response = await axios.put(`${baseUrl}/todo/${id}`, values);
            } else {
              response = await axios.post(`${baseUrl}/todo`, values);
            }
          if (response.status === 201 || response.status === 200 ) {
            setLoader(false)
            navigate('/')
          }
        } catch (error) {
          setLoader(false)
          triggerNotification("error", "", "Error while create task ", "topRight");
        }
      };

    const handleBack = () =>{
        navigate('/')
    }


  return (
    <div className="full-width-container">
      <p className="page-title font-Inter w-1/2 p-0 pt-8 mb-5 flex items-center"> <span className="material-symbols-outlined mr-2 cursor-pointer" onClick={()=>{handleBack()}}>
        arrow_back</span> {isEdit ? "Edit Task": 'Create new task' } </p>
        <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true} >
      {({ isSubmitting, values ,setFieldValue}) => (
        <Form className="space-y-4 w-[70%] mx-auto my-0">
            <div className="w-full flex flex-wrap ">
          <div className="relative flex flex-col  w-1/2 mb-8">
            <label htmlFor="title" >Title</label>
            <Field as={Input} className='w-full' id="title" name="title" placeholder="Enter title" value ={values.title}/>
            <ErrorMessage name="title" component="div" className="error-message"  />
          </div>

          <div className="relative flex flex-col  w-1/2 mb-8">
            <label htmlFor="status">Status</label>
            <Field  as={Select} className="w-[300px]" id="status" name="status" value={values.status} onChange={(value: any) => setFieldValue("status", value)}  >
              {statusOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                    {option.label}
                </Select.Option>
              ))}
            </Field>
            <ErrorMessage name="status" component="div" className="error-message"  />
          </div>

          <div className="relative flex flex-col w-1/2 mb-8">
            <label htmlFor="dueDate">Due Date</label>
            <DatePicker
                className="float-control"
                name="dueDate"
                value={values.dueDate} 
                onChange={(date, dateString) => setFieldValue("dueDate", dateString)}
                format="YYYY-MM-DD"
                placeholder="Start Date"
                data-testid="start-date-picker"
                />
            <ErrorMessage name="dueDate" component="div" className="error-message"  />
          </div>

          <div className="relative flex flex-col w-1/2 mb-8">
            <label htmlFor="description">Description</label>
            <Field as={TextArea}  id="description" name="description" placeholder="Enter description" />
            <ErrorMessage name="description" component="div" className="error-message"  />
          </div>

          <div className="relative flex flex-col w-1/2 mb-8">
            <label htmlFor="assignedUser">Assigned User</label>
            <Field as={Select} className="w-[300px]"  id="assignedUser" name="assignedUser" 
             onChange={(value: any) => setFieldValue("assignedUser", value)}>
              {usersList.map((user) => (
                <Select.Option  key={user.id} value={user.id}>
                 {user.name}
            </Select.Option>
              ))}
            </Field>
            <ErrorMessage name="assignedUser" component="div" className="error-message"  />
          </div>

          <div className="relative flex flex-col w-1/2 mb-8">
            <label htmlFor="priority">Priority</label>
            <Field as={Select} className="w-[300px]"   id="priority" name="priority"  
             onChange={(value: any) => setFieldValue("priority", value)}>
              {priorityOptions.map((priority) => (
                <Select.Option  key={priority.value} value={priority.value}>
                 {priority.label}
            </Select.Option>
          
              ))}
            </Field>
            <ErrorMessage name="priority" component="div" className="error-message"  />
          </div>

          <div className="relative flex flex-col w-1/2 mb-8">
            <label htmlFor="tags">Tags</label>
            <Field
              id="tags"
              name="tags"
              placeholder="Enter tags (comma-separated)"
              as={TextArea} 
            />
            <ErrorMessage name="tags" component="div" className="error-message"  />
          </div>
           </div>
           <div className="flex justify-center">
            <Button type="primary" disabled={isSubmitting} className="login-btn w-[156px]" htmlType="submit">
            {isEdit ? "Update" : "Create"}
            </Button>
           </div>
        </Form>
      )}
    </Formik>
    </div>
  )
}

export default CreateTask
