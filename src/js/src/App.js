import React, {Component} from 'react'
import Container from './Container'
import Footer from "./Footer";
import './App.css';
import {getAllStudents} from './client';
import {errorNotification} from "./Notification";
import {
    Table,
    Avatar,
    Spin,
    Modal,
    Empty
} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import AddStudentFrom from './forms/AddStudentForm'

const getIndicatorIcon = () => <LoadingOutlined style={{fontSize: 24}} spin/>;

class App extends Component {

    state = {
        students: [],
        isFetching: false,
        isAddStudentModalVisible: false
    }

    openAddStudentModal = () => this.setState({isAddStudentModalVisible: true})

    closeAddStudentModal = () => this.setState({isAddStudentModalVisible: false})


    componentDidMount() {
        this.fetchStudents();
    }

    fetchStudents = () => {
        this.setState({
            isFetching: true
        })
        getAllStudents()
            .then(res => res.json()
                .then(students => {
                    this.setState({
                        students,
                        isFetching: false
                    })
                }))
            .catch(error => {
                const message = error.error.message
                const description = error.error.error
                errorNotification(message, description)
                console.log(error.error)
                this.setState({
                    isFetching: false
                })
            })
    }

    render() {

        const {students, isFetching, isAddStudentModalVisible} = this.state

        const commonElements = () => (
            <div>
                <Modal
                    title='Add new student'
                    visible={isAddStudentModalVisible}
                    onOk={this.closeAddStudentModal}
                    onCancel={this.closeAddStudentModal}
                    width={1000}
                >
                    <AddStudentFrom
                        onSuccess={() => {
                            this.closeAddStudentModal();
                            this.fetchStudents()
                        }}
                        onFailure={(error) => {
                            const message = error.error.message
                            const description = error.error.httpStatus
                            errorNotification(message, description)
                        }}
                    />
                </Modal>
                <Footer
                    numberOfStudents={students.length}
                    handleAddStudentClickEvent={this.openAddStudentModal}/>
            </div>
        )


        if (isFetching) {
            return (
                <Container>
                    <Spin indicator={getIndicatorIcon()}/>
                </Container>
            )
        }

        if (students && students.length) {

            const columns = [
                {
                    title: 'Avatar',
                    key: 'avatar',
                    render: (text, student) => (
                        <Avatar size='large'>
                            {`${student.firstName.charAt(0).toUpperCase()}${student.lastName.charAt(0).toUpperCase()}`}
                        </Avatar>
                    )
                },
                {
                    title: 'Student Id',
                    dataIndex: 'studentId',
                    key: 'studentId'
                },
                {
                    title: 'First Name',
                    dataIndex: 'firstName',
                    key: 'firstName'
                },
                {
                    title: 'Last Name',
                    dataIndex: 'lastName',
                    key: 'lastName'
                },
                {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email'
                },
                {
                    title: 'Gender',
                    dataIndex: 'gender',
                    key: 'gender'
                }
            ];

            return (
                <Container>
                    <Table
                        style={{marginBottom: '100px'}}
                        dataSource={students}
                        columns={columns}
                        pagination={false}
                        rowKey='studentId'/>
                    {commonElements()}
                </Container>
            );
        }

        return (
            <Container>
                <Empty description={
                    <h1>No Students Found</h1>
                }/>
                {commonElements()}
            </Container>
        )
    }
}

export default App;
