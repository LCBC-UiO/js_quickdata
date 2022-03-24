////////////////////////////////////
// GETTING DATA FROM SYSTEM FILES //
async function get_data() {
    const r_data = await fetch("./data/data.json");
    r_data_j = await r_data.json();
    let e_data = document.getElementById("v-pills-tab");
    for(var i in r_data_j){
        var e_btn = document.createElement("button");
        e_btn.classList = "btn btn-secondary btn-lg m-2";
        e_btn.id = i;
        e_btn.type = "button";
        e_btn.role = "tab";
        e_btn.setAttribute("data-bs-toggle", "pill");
        e_btn.setAttribute("data-bs-target", "#list-" + i);
        e_btn.setAttribute("aria-controls", "list-" + i);
        e_btn.setAttribute("aria-selected", "true");
        e_btn.innerHTML = r_data_j[i];
        e_btn.onclick = get_tsv;
        e_data.appendChild(e_btn);
    }
};

async function get_tsv(){
    var getstr = "./cgi/get_data_csv.cgi?=" + this.id;
    const r = await fetch(getstr);
    if (!r.ok) {
        console.log("error ok");
    }
    e_lastmod = document.getElementById("lastmod");
    var getstr_l = "./cgi/get_lastmod.cgi?=" + this.id;
    const r_lastmod = await fetch(getstr_l);
    txt = await r_lastmod.text()
    e_lastmod.innerHTML = `Last updated on ${txt}`;
    const tsv_str = await r.text();
    const table = tsv_str.split("\n").map(l => l.split("\t"));
    if (document.querySelector('#v-pills-tab button.active') !== null) {
        document.querySelector('#v-pills-tab button.active').classList.remove('active');
    }
    var e_target = document.getElementById(this.id);
    e_target.classList.add("active");
    await display_table(table);
}

async function display_table(table){
    const e_table = document.getElementById("tsv");
    e_table.innerHTML = ""; // remove previous table from div
    // if ncol is null or more columns than table has, take all columns
    let ncol = table[0].length;
    var e_tbody = document.createElement("tbody");
    table.forEach((r,row_idx) => {
        const e_tr = document.createElement("tr");
        if(row_idx == 0){ // make table header
            const e_thead = document.createElement("thead");
            e_thead.classList = "table-dark";
            e_thead.setAttribute("scope", "col");
            e_thead.appendChild(e_tr);
            e_table.appendChild(e_thead);
            var e_type = "th";
        }else{
            e_tbody.appendChild(e_tr);
            var e_type = "td";
        }
        for (let col_idx = 0; col_idx < ncol; col_idx++) {
            let f = r[col_idx]
            const e_td = document.createElement(e_type);
            e_td.innerHTML = f;
            if(row_idx == 0){
                e_td.classList.add("table-th");
            }
            e_tr.appendChild(e_td);
        }
        e_table.appendChild(e_tbody);

    });
}


// Start the whole thing, grab data list!
get_data();
