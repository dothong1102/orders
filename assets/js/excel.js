function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

let btn = document.getElementById('excel-btn');
btn.addEventListener('click', function() {
    var wb = XLSX.utils.table_to_book(document.getElementById('tblListInfo'), { sheet: "Orders" });
    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'test.xlsx');

})