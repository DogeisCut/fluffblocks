function block(type, ...extra) {
    return `<block type="${type}">${extra?.join?.("")}</block>`;
}
function value(name, ...extra) {
    return `<value name="${name}">${extra?.join?.("")}</value>`;
}
function shadow(type, ...extra) {
    return `<shadow type="${type}">${extra?.join?.("")}</shadow>`;
}
function sep(sep = 30) {
    return `<sep gap="${sep}"></sep>`;
}
function shadowNumber(value = 10) {
    return `<shadow type="values_number"><field name="NUMBER">${value}</field></shadow>`;
}
function shadowAny(value = "") {
    return `<shadow type="values_any"><field name="ANY">${value}</field></shadow>`;
}
function shadowSTRING(value = "") {
    return `<shadow type="values_string"><field name="STRING">${value}</field></shadow>`;
}
function shadowBoolean(value = true) {
    return `<shadow type="logic_boolean"><field name="BOOL">${value ? "TRUE" : "FALSE"}</field></shadow>`;
}

const toolbox = `
    <category name="Events" colour="#d81b1b">
        ${block("events_on_start")}
    </category>

    <category name="Control" colour="#d8571b">
    </category>

    <category name="Input" colour="#d8961b">
    </category>

    ${sep()}

    <category name="Math" colour="#cbd81b">
        ${block("values_number")}
        ${block("math_binary", value('A', shadowAny()), value('B', shadowAny()))}
    </category>

    <category name="Strings" colour="#9fd81b">
        ${block("values_string")}
    </category>

    <category name="Color" colour="#67d81b">
    </category>

    <category name="Vectors" colour="#1bd81b">
        ${block("vectors_vector_of_menu")}
        ${block("vectors_vector_x_x_y_y", value('X', shadowNumber(1)), value('Y', shadowNumber(1)))}
        ${block("vectors_vector_magnitude_magnitude_angle_angle", value('MAGNITUDE', shadowNumber(1)), value('ANGLE', shadowNumber(45)))}
        ${sep(50)}
        ${block("vectors_menu_of_vector")}
        ${block("vectors_vector_menu")}
        ${sep(50)}
        ${block("vectors_vector_rotated_by_angle", value('ANGLE', shadowNumber(45)))}
    </category>

    <category name="Arrays" colour="#1bd86a">
        ${block("arrays_array")}
        ${block("arrays_array_builder")}
    </category>

    <category name="Tables" colour="#1bd879">
    </category>

    <category name="Sprites" colour="#1bd8a9">
    </category>

    <category name="Threads" colour="#1b8cd8">
    </category>

    <category name="Matrices" colour="#1b47d8">
    </category>

    ${sep()}

    <category name="Utility" colour="#1e1bd8">
        ${block("values_any")}
    </category>

    ${sep()}

    <category name="Transforms" colour="#631bd8">
        ${block("transforms_reparent_to_sprite")}
        ${block("transforms_set_space_position_to_vector")}
    </category>

    ${sep()}

    <category name="Graphics" colour="#8c1bd8">
    </category>

    <category name="Audio" colour="#c81bd8">
    </category>

    ${sep()}

    <category name="Drawing" colour="#d81bc8">
    </category>

    ${sep()}

    <category name="Labeling" colour="#777777">
        ${block('labeling_placeholder')}
        ${block('labeling_label')}
    </category>

    <category name="Debugging" colour="#d81b83">
        ${block("print_any_to_console", value('ANY', shadowAny("foo")))}
    </category>

    ${sep()}
`;

export default toolbox;