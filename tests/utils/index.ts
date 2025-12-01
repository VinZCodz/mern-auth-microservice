import { DataSource } from 'typeorm'

export const truncateTables = async (dataSource: DataSource) => {
    const tablesMeta = dataSource.entityMetadatas

    for (const tableMeta of tablesMeta) {
        const table = dataSource.getRepository(tableMeta.name)

        await table.clear()
    }
}
