import React from "react"
import { Button, Upload, message, Row, Col } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import excel from "exceljs"
import PropTypes from "prop-types"
import handler from "./handlers"

class UploadFile extends React.Component {
    state = {
        servers: [],
    }
    render() {
        return (
            <>
                <Row gutter={[16, 16]}>
                    <Col span="24">
                        <Upload beforeUpload={this.beforeUpload}>
                            <Button>
                                <UploadOutlined /> Click to Upload
                            </Button>
                        </Upload>
                    </Col>
                    <Col span="24">
                        <Button
                            type="primary"
                            disabled={!this.state.servers.length}
                            onClick={this.onStartUpload}
                        >
                            Start Upload
                        </Button>
                    </Col>
                </Row>
            </>
        )
    }

    beforeUpload = (file) => {
        // read file as buffer
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = async () => {
            const buffer = reader.result

            // read file excel using file buffer
            const wb = new excel.Workbook()
            let workbook = await wb.xlsx.load(buffer)

            // create empty array to store all servers
            let servers = []

            // we assume we have only one sheet
            workbook.eachSheet((sheet) => {
                // rowNum starts from 1
                sheet.eachRow((row, rowNum) => {
                    // first row consist of names columns so we will skip it
                    if (rowNum > 1) {
                        const [
                            blank,
                            model,
                            ram,
                            hdd,
                            location,
                            price,
                        ] = row.values
                        let server = { model, ram, hdd, location, price }
                        servers.push(server)
                    }
                })
            })
            this.setState({ servers })
        }
        return false
    }

    onStartUpload = () => {
        if (this.state.servers.length)
            handler.API.uploadData({ servers: this.state.servers })
                .then(() => {
                    message.success("Data uploaded successfull")
                })
                .catch(() => {
                    message.error("Data upload failed")
                })
        else message.warning("No data available to upload")
    }
}

UploadFile.propTypes = {}

export default UploadFile
