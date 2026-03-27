function block(type, ...extra) {
  return `<block type="${type}">${extra?.join?.("")}</block>`;
}
function value(name, ...extra) {
  return `<value name="${name}">${extra?.join?.("")}</value>`;
}
function shadow(type, ...extra) {
  return `<shadow type="${type}">${extra?.join?.("")}</shadow>`;
}
function sep(sep) {
  return `<sep gap="${sep}"></sep>`;
}
function shadowNumber(value = 10) {
  return `<shadow type="math_number"><field name="NUM">${value}</field></shadow>`;
}
function shadowText(value = "") {
  return `<shadow type="text"><field name="TEXT">${value}</field></shadow>`;
}
function shadowBoolean(value = true) {
  return `<shadow type="logic_boolean"><field name="BOOL">${value ? "TRUE" : "FALSE"}</field></shadow>`;
}

const toolbox = `
    <category name="Events" colour="#d89c1b">
        ${block("on_start")}
    </category>
    
    <category name="Transforms" colour="#2f2ccf">
        ${block("set_position_to_vector")}
    </category>

    <category name="Variables" colour="#cf6813" custom="VARIABLES"></category>
`;

export default toolbox;