import React, { useState, useEffect } from "react"
import {
    Table,
    Row,
    Col,
    Slider,
    Checkbox,
    Select,
    message,
    Button,
} from "antd"
import handler from "./handlers"
const { Option } = Select
const columns = [
    {
        title: "Model",
        dataIndex: "model",
    },
    {
        title: "RAM",
        dataIndex: "ram",
    },
    {
        title: "HDD",
        dataIndex: "hdd",
    },
    {
        title: "Location",
        dataIndex: "location",
    },
    {
        title: "Price",
        dataIndex: "price",
    },
]
const hddTypeFilters = [
    { title: "SAS", value: "SAS" },
    { title: "SATA", value: "SATA2" },
    { title: "SSD", value: "SSD" },
]
const ramFilters = [
    { label: "2GB", value: 2 },
    { label: "4GB", value: 4 },
    { label: "8GB", value: 8 },
    { label: "12GB", value: 12 },
    { label: "16GB", value: 16 },
    { label: "24GB", value: 24 },
    { label: "32GB", value: 32 },
    { label: "48GB", value: 48 },
    { label: "64GB", value: 64 },
    { label: "96GB", value: 96 },
]
const storageFilter = {
    marks: {
        0: "0GB",
        8: "250GB",
        16: "500GB",
        24: "1TB",
        32: "2TB",
        40: "3TB",
        48: "4TB",
        56: "8TB",
        64: "12TB",
        72: "24TB",
        80: "48TB",
        88: "72TB",
    },
}
class Dashboard extends React.Component {
    state = {
        storage: [0, 72],
        ram: [],
        hddType: null,
        location: null,
        dataSource: [],
        locationFilters: [],
        currPage: 1,
        pages: 1,
        isLoading: false,
    }
    componentDidMount() {
        this.fetchData()
        handler.API.fetchLocationFilters()
            .then((data) => {
                this.setState({ locationFilters: data.map((d) => d.DISTINCT) })
            })
            .catch(() => {
                this.setState({ locationFilters: [] })
                message.error("Error while fetching data from server")
            })
    }
    render() {
        const {
            storage,
            ram,
            hddType,
            location,
            dataSource,
            locationFilters,
            currPage,
            pages,
            isLoading,
        } = this.state
        return (
            <>
                <Row gutter={[16, 16]}>
                    <Col span="24">
                        <h3>Filters</h3>
                        <h4>Storage</h4>
                        <Slider
                            range
                            step={8}
                            min={0}
                            max={88}
                            tipFormatter={null}
                            value={storage}
                            onChange={(value) =>
                                this.setState({ storage: value })
                            }
                            marks={storageFilter.marks}
                        ></Slider>
                        <h4>RAM</h4>
                        <Checkbox.Group
                            options={ramFilters}
                            value={ram}
                            onChange={(value) => this.setState({ ram: value })}
                        ></Checkbox.Group>
                        <h4>HDD type</h4>
                        <Select
                            placeholder="Select HDD Type"
                            value={hddType}
                            allowClear
                            onChange={(value) =>
                                this.setState({ hddType: value })
                            }
                        >
                            {hddTypeFilters.map((hddType) => (
                                <Option value={hddType.value}>
                                    {hddType.title}
                                </Option>
                            ))}
                        </Select>
                        <h4>Location</h4>
                        <Select
                            placeholder="Select Location"
                            value={location}
                            allowClear
                            onChange={(value) =>
                                this.setState({ location: value })
                            }
                        >
                            {locationFilters.map((location) => (
                                <Option value={location}>{location}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span="24">
                        <Button type="primary" onClick={this.onFilter}>
                            Filter
                        </Button>
                    </Col>
                    <Col span="24">
                        <h4>
                            Page: {currPage} / {pages}
                        </h4>
                        <Table
                            bordered
                            columns={columns}
                            dataSource={dataSource}
                            pagination={false}
                            loading={isLoading}
                        ></Table>
                        <Button disabled={currPage === 1} onClick={this.onPrev}>
                            Prev
                        </Button>
                        <Button
                            disabled={currPage === pages}
                            onClick={this.onNext}
                        >
                            Next
                        </Button>
                    </Col>
                </Row>
            </>
        )
    }
    onFilter = () => {
        this.fetchData()
    }
    onPrev = () => {
        this.setState(
            (prevState) => ({
                currPage: prevState.currPage - 1,
            }),
            () => {
                this.fetchData()
            }
        )
    }
    onNext = () => {
        this.setState(
            (prevState) => ({
                currPage: prevState.currPage + 1,
            }),
            () => {
                this.fetchData()
            }
        )
    }
    fetchData = () => {
        this.setState({ isLoading: true }, async () => {
            const { ram, hddType, location, storage, currPage } = this.state
            const storageValues = storage.map(
                (x) => storageFilter.marks[parseInt(x)]
            )
            let filter = ""
            filter += `storage=${storageValues.join(",")}`
            if (ram.length) filter += `${filter ? "&" : ""}ram=${ram.join(",")}`
            if (hddType) filter += `${filter ? "&" : ""}hdd=${hddType}`
            if (location) filter += `${filter ? "&" : ""}location=${location}`
            if (filter) filter = `?` + filter
            let data = await handler.API.fetchData({
                filters: filter,
                page: currPage,
            }).catch(() => {
                this.setState({ dataSource: [] })
                message.error("Error while fetching data from server")
            })
            this.setState({
                dataSource: data.result,
                pages: data.pages,
                isLoading: false,
            })
        })
    }
}

export default Dashboard
