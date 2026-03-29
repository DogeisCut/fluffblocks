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
function shadowBoolean(value = false) {
    return `<shadow type="values_boolean"><field name="BOOLEAN">${value ? 'TRUE' : 'FALSE'}</field></shadow>`;
}
function shadowAny(value = "") {
    return `<shadow type="values_any"><field name="ANY">${value}</field></shadow>`;
}
function shadowVector(x = 0, y = 0) {
    return `<shadow type="values_vector"><field name="X">${x}</field><field name="Y">${y}</field></shadow>`;
    //return `<shadow type="vectors_vector_x_y">${value('X', shadowNumber(x))}${value('Y', shadowNumber(y))}</shadow>`;
}
function shadowString(value = "") {
    return `<shadow type="values_string"><field name="STRING">${value}</field></shadow>`;
}
const toolbox = `
    <category name="Events" colour="#CC5252">
        ${block("events_on_start")}
    </category>

    <category name="Control" colour="#D27654">
        ${block("control_if", value('IF0', shadowBoolean()))}
        <block type="control_switch">
            <mutation default="FALSE">
                <case empty="FALSE"></case>
            </mutation>
            <value name="ANY">
                <shadow type="values_any">
                    <field name="ANY"></field>
                </shadow>
            </value>
            <value name="CASE0">
                <shadow type="values_any">
                    <field name="ANY"></field>
                </shadow>
            </value>
            <statement name="DO0">
                <shadow type="control_break"></shadow>
            </statement>
        </block>
        ${sep(50)}
        ${block("control_break")}
    </category>

    <category name="Input" colour="#D79D56">
    </category>

    ${sep()}

    <category name="Booleans" colour="#DCC458">
        ${block("values_boolean")}
        ${sep(50)}
        ${block("booleans_any_to_boolean", value('ANY', shadowAny("false")))}
        ${sep(50)}
        ${block("booleans_binary_logic", value('A', shadowBoolean()), value('B', shadowBoolean()))}
        ${block("booleans_not", value('BOOLEAN', shadowBoolean()))}
    </category>

    <category name="Numbers" colour="#D4E05A">
        ${block("values_number")}
        ${sep(50)}
        ${block("number_unary_operation", value('ANY', shadowAny("10")))}
    </category>

    <category name="Strings" colour="#B2E45B">
        ${block("values_string")}
        ${sep(50)}
        ${block("strings_any_to_string", value('ANY', shadowAny("10")))}
    </category>

    <category name="Color" colour="#8FE75C">
    </category>

    <category name="Vectors" colour="#6AE95D">
        ${block("vectors_vector_of_menu")}
        ${block("vectors_vector_x_y", value('X', shadowNumber(1)), value('Y', shadowNumber(1)))}
        ${block("vectors_vector_magnitude_angle", value('MAGNITUDE', shadowNumber(1)), value('ANGLE', shadowNumber(45)))}
        ${sep(50)}
        ${block("vectors_menu_of_vector")}
        ${block("vectors_vector_menu")}
        ${sep(50)}
        ${block("vectors_vector_rotated_by_angle", value('ANGLE', shadowNumber(45)))}
    </category>

    <category name="Arrays" colour="#5EEB77">
        ${block("arrays_array", '<mutation nextid="1"><item id="ITEM0"></item></mutation>')}
        ${sep(50)}
        ${block("arrays_array_builder")}
        ${block("arrays_append_value_to_builder", value('ANY', shadowAny('foo')))}
    </category>

    <category name="Tables" colour="#5EEC9E">
    </category>

    <category name="Sprites" colour="#5EECC5">
    </category>

    <category name="Threads" colour="#5EECEC">
    </category>

    <category name="Matrices" colour="#5EC4EB">
        ${block("matrices_matrix", value('X', shadowVector(1, 0)), value('Y', shadowVector(0, 1)), value('ORIGIN', shadowVector(0, 0)))}
        ${sep(50)}
    </category>

    ${sep()}

    <category name="Utility" colour="#5D9DE9">
        ${block("values_any")}
        ${sep(50)}
        ${block("utility_binary_operations", value('A', shadowAny()), value('B', shadowAny()))}
        ${block("utility_binary_comparisons", value('A', shadowAny()), value('B', shadowAny()))}
        ${sep(50)}
        ${block("utility_void")}
    </category>

    ${sep()}

    <category name="Transforms" colour="#5C75E7">
        ${block("transforms_reparent_to_sprite")}
        ${sep(50)}
        ${block("transforms_set_space_position_to_vector")}
        ${sep(50)}
        ${block("transforms_set_space_transform_to_vector")}
    </category>

    ${sep()}

    <category name="Graphics" colour="#685BE4">
    </category>

    <category name="Audio" colour="#8B5AE0">
    </category>

    ${sep()}

    <category name="Drawing" colour="#AC58DC">
    </category>

    ${sep()}

    <category name="Labeling" colour="#777777">
        ${block('labeling_placeholder')}
        ${block('labeling_label')}
    </category>

    <category name="Debugging" colour="#666666">
        ${block("print_any_to_console", value('ANY', shadowAny("foo")))}
    </category>

    ${sep()}

    <category name="Variables" colour="#D254BB" custom="VARIABLES">
    </category>

    <category name="Functions" colour="#CC5294" custom="FUNCTIONS">
    </category>

    ${sep()}
`;

export default toolbox;