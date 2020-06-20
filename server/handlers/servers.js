import { Op, literal } from "sequelize"
import orm from "../sequelize"

const fetchServers = async ({ storage, ram, hdd, location, page }) => {
    let limit = 10
    let offset = 0
    let where = {}
    if (storage) {
        const storagLimits = storage.split(",")
        const [min, max] = storagLimits.map((s) => {
            let val = s.substring(0, s.length - 2)
            if (val != 0 && s.includes("GB")) return parseInt(val) / 1000
            return parseInt(val)
        })
        where[Op.and] = literal(
            `(hddCapicity*hddCount) BETWEEN '${min}' AND '${max}'`
        )
    }
    if (ram) where["ramCapicity"] = { [Op.in]: ram.split(",") }
    if (hdd) where["hddType"] = { [Op.eq]: hdd }
    if (location) where["location"] = { [Op.eq]: location }
    let countResult = await orm.Servers.findAndCountAll({ where: where })
    let pages = Math.ceil(countResult.count / limit)
    offset = limit * (page - 1)
    let result = await orm.Servers.findAll({
        where: where,
        limit: limit,
        offset: offset,
    })
    let data = result.map((res, i) => {
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
    return {
        result: data,
        pages,
    }
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
