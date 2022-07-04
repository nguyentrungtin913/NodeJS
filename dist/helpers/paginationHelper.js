"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
function pagination(res, list, name, code, msgKey, description, totalElement, page, limit) {
    let totalPage = 1;
    if (totalElement > limit) {
        totalPage = Math.floor(totalElement / limit);
        if (totalElement % limit > 0) {
            totalPage++;
        }
    }
    let result = {
        "code": code,
        "msgKey": msgKey,
        "description": description,
        "data": {
            [name]: list,
            "pagination": {
                "total": totalElement,
                "perPage": limit,
                "currentPage": page,
                "lastPage": totalPage
            }
        }
    };
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
}
exports.pagination = pagination;
