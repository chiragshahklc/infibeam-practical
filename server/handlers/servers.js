import { Op } from "sequelize"
import orm from "../sequelize"

const fetchServers = async ({ storage, ram, hdd, location }) => {
    let where = {}
    // const [min, max] = storage.split(",")
    // min = min.includes("GB")
    //     ? parseInt(min.substring(0, min.length - 2)) !== 0
    //         ? parseInt(min.substring(0, min.length - 2)) / 1000
    //         : 0
    //     : parseInt(min.substring(0, min.length - 2))
    // max = max.includes("GB")
    //     ? parseInt(max.substring(0, max.length - 2)) !== 0
    //         ? parseInt(max.substring(0, max.length - 2)) / 1000
    //         : 0
    //     : parseInt(max.substring(0, max.length - 2))
    // console.log(min, max)
    if (ram) where["ramCapicity"] = { [Op.in]: ram.split(",") }
    if (hdd) where["hddType"] = { [Op.eq]: hdd }
    if (location) where["location"] = { [Op.eq]: location }

    let result = await orm.Servers.findAll({
        where: where,
    })
    return result.map((res, i) => {
        let {
            id,
            model,
            ramCapicity,
            ramType,
            hddCapicity,
            hddCount,
            hddType,
            location,
            price,
        } = res.toJSON()
        return {
            key: id,
            ram: `${ramCapicity}GB ${ramType}`,
            hdd: `${hddCount}x${
                hddCapicity < 1 ? 1000 * hddCapicity : hddCapicity
            }${hddCapicity < 1 ? "GB" : "TB"} ${hddType}`,
            model,
            location,
            price,
        }
    })
}

const addServers = async (servers) => {
    servers = servers.map(({ model, ram, hdd, location, price }) => {
        const [ramCapicity, ramType] = ram.split("GB")
        const hddSplitter = hdd.includes("GB") ? "GB" : "TB"
        const [hddTotalCapicity, hddType] = hdd.split(hddSplitter)
        const [hddCount, hddCapicity] = hddTotalCapicity.split("x")
        return {
            model,
            ramCapicity,
            ramType,
            hddCount,
            hddCapicity:
                hddSplitter == "GB"
                    ? parseInt(hddCapicity) / 1000
                    : hddCapicity,
            hddType,
            location,
            price,
        }
    })
    let result = await orm.Servers.bulkCreate(servers, { validate: true })
    return result
}

const fetchDistinctLocations = async () => {
    let result = await orm.Servers.aggregate("location", "DISTINCT", {
        plain: false,
    })
    return result
}

export default { fetchServers, addServers, fetchDistinctLocations }
