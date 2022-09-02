function notFound(err: string, errPlural: string): object {
    return {
        type: 'error_not_found',
        message: `This ${err} was not founded, it doesn't be in ${errPlural} datas`
    }
}

function conflict(err: string, conflict: string): object {
    return {
        type: 'error_conflict',
        message: `This ${err} already ${conflict}`
    }
}

function unhautorized(err: string): object {
    return {
        type: 'error_unhautorized',
        message: `Unhautorized! ${err}`
    }
}

function badRequest(err: string): object {
    return {
        type: 'error_bad_request',
        message: err
    }
}

export { notFound, conflict, unhautorized, badRequest }