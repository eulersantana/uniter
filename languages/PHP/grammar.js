/*
 * Uniter - JavaScript PHP interpreter
 * Copyright 2013 Dan Phillimore (asmblah)
 * http://asmblah.github.com/uniter/
 *
 * Released under the MIT license
 * https://github.com/asmblah/uniter/raw/master/MIT-LICENSE.txt
 */

/*
 * PHP Grammar
 */

/*global define */
define([
    './grammar/ErrorHandler'
], function (
    PHPErrorHandler
) {
    'use strict';

    /*
     * Elimination of left-recursion: http://web.cs.wpi.edu/~kal/PLT/PLT4.1.2.html
     */

    var stringEscapeReplacements = [{
            pattern: /\\([\$efnrtv\\"])/g,
            replacement: function (all, chr) {
                return {
                    'e': '\x1B', // Escape
                    'f': '\f',   // Form feed
                    'n': '\n',   // Linefeed
                    'r': '\r',   // Carriage-return
                    't': '\t',   // Horizontal tab
                    'v': '\x0B', // Vertical tab (JS '\v' escape not supported in IE < 9)
                    '\\': '\\',
                    '$': '$',
                    '"': '"'
                }[chr];
            }
        }];

    return {
        ErrorHandler: PHPErrorHandler,
        ignore: 'N_IGNORE',
        rules: {
            'T_ABSTRACT': /abstract\b/i,
            'T_AND_EQUAL': /&=/i,
            'T_ARRAY': /array\b/i,
            'T_ARRAY_CAST': /\(\s*array\s*\)/i,
            'T_AS': /as\b/i,

            // Anything below ASCII 32 except \t (0x09), \n (0x0a) and \r (0x0d)
            'T_BAD_CHARACTER': /(?![\u0009\u000A\u000D])[\u0000-\u001F]/,

            'T_BOOLEAN_AND': /&&/i,
            'T_BOOLEAN_OR': /\|\|/,
            'T_BOOL_CAST': /\(\s*bool(ean)?\s*\)/i,
            'T_BREAK': /break\b/i,
            'T_CALLABLE': /callable\b/i,
            'T_CASE': /case\b/i,
            'T_CATCH': /catch\b/i,
            'T_CLASS': /class\b/i,
            'T_CLASS_C': /__CLASS__/i,
            'T_CLONE': /clone/i,
            'T_CLOSE_TAG': /[?%]>\n?/,
            'T_COMMENT': /(?:\/\/|#)(.*?)[\r\n]+|\/\*(?!\*)([\s\S]*?)\*\//,
            'T_CONCAT_EQUAL': /\.=/,
            'T_CONST': /const\b/i,
            'T_CONSTANT_ENCAPSED_STRING': {oneOf: [
                // Single-quoted
                {what: /'((?:[^']|\\')*)'/, captureIndex: 1},
                // Double-quoted
                {what: /"((?:(?!\$\{?[\$a-z0-9_]+)(?:[^\\"]|\\[\s\S]))*)"/, captureIndex: 1, replace: stringEscapeReplacements}
            ]},
            'T_CONTINUE': /continue\b/i,
            'T_CURLY_OPEN': /\{(?=\$)/,
            'T_DEC': /--/i,
            'T_DECLARE': /declare\b/i,
            'T_DEFAULT': /default\b/i,
            'T_DIR': /__DIR__\b/i,
            'T_DIV_EQUAL': /\/=/,

            // See http://www.php.net/manual/en/language.types.float.php
            'T_DNUMBER': /\d+\.\d+|\d\.\d+e\d+|\d+e[+-]\d+/i,

            'T_DOC_COMMENT': /\/\*\*([\s\S]*?)\*\//,
            'T_DO': /do\b/i,
            'T_DOLLAR_OPEN_CURLY_BRACES': /\$\{/,
            'T_DOUBLE_ARROW': /=>/,
            'T_DOUBLE_CAST': /\((real|double|float)\)/i,

            // Also defined as T_PAAMAYIM_NEKUDOTAYIM
            'T_DOUBLE_COLON': /::/i,

            'T_ECHO': /echo\b/i,
            'T_ELSE': /else\b/i,
            'T_ELSEIF': /elseif\b/i,
            'T_EMPTY': /empty\b/i,
            'T_ENCAPSED_AND_WHITESPACE': /(?:[^"\${]|\\["\${])+/,
            'T_ENDDECLARE': /enddeclare\b/i,
            'T_ENDFOR': /endfor\b/i,
            'T_ENDFOREACH': /endforeach\b/i,
            'T_ENDIF': /endif\b/i,
            'T_ENDSWITCH': /endswitch\b/i,
            'T_ENDWHILE': /endwhile\b/i,

            // Token gets defined as a pushed token after a Heredoc is found
            'T_END_HEREDOC': /(?!)/,

            'T_EVAL': /eval\b/i,
            'T_EXIT': /(?:exit|die)\b/i,
            'T_EXTENDS': /extends\b/i,
            'T_FILE': /__FILE__\b/i,
            'T_FINAL': /final\b/i,
            'T_FINALLY': /finally\b/i,
            'T_FOR': /for\b/i,
            'T_FOREACH': /foreach\b/i,
            'T_FUNCTION': /function\b/i,
            'T_FUNC_C': /__FUNCTION__\b/i,
            'T_GLOBAL': /global\b/i,
            'T_GOTO': /goto\b/i,
            'T_HALT_COMPILER': /__halt_compiler(?=\(\)|\s|;)/,
            'T_IF': /if\b/i,
            'T_IMPLEMENTS': /implements\b/i,
            'T_INC': /\+\+/,
            'T_INCLUDE': /include\b/i,
            'T_INCLUDE_ONCE': /include_once\b/i,
            'T_INLINE_HTML': /(?:[^<]|<[^?%]|<\?(?!php)[\s\S]{3})+/,
            'T_INSTANCEOF': /instanceof\b/i,
            'T_INSTEADOF': /insteadof\b/i,
            'T_INT_CAST': /\(\s*int(eger)?\s*\)/i,
            'T_INTERFACE': /interface\b/i,
            'T_ISSET': /isset\b/i,
            'T_IS_EQUAL': /==(?!=)/i,
            'T_IS_GREATER_OR_EQUAL': />=/,
            'T_IS_IDENTICAL': /===/i,
            'T_IS_NOT_EQUAL': /!=|<>/,
            'T_IS_NOT_IDENTICAL': /!==/,
            'T_IS_SMALLER_OR_EQUAL': /<=/,
            'T_LINE': /__LINE__\b/i,
            'T_LIST': /list\b/i,
            'T_LNUMBER': /\d+|0x[0-9a-f]/i,
            'T_LOGICAL_AND': /and\b/i,
            'T_LOGICAL_OR': /or\b/i,
            'T_LOGICAL_XOR': /xor\b/i,
            'T_METHOD_C': /__METHOD__\b/i,
            'T_MINUS_EQUAL': /-=/i,

            // Not used anymore (PHP 4 only)
            'T_ML_COMMENT': /(?!)/,

            'T_MOD_EQUAL': /%=/i,
            'T_MUL_EQUAL': /\*=/,
            'T_NAMESPACE': /namespace\b/i,
            'T_NS_C': /__NAMESPACE__\b/i,
            'T_NS_SEPARATOR': /\\/,
            'T_NEW': /new\b/i,
            'T_NUM_STRING': /\d+/,
            'T_OBJECT_CAST': /\(\s*object\s*\)/i,
            'T_OBJECT_OPERATOR': /->/,

            // Not used anymore (PHP 4 only)
            'T_OLD_FUNCTION': /old_function\b/i,

            'T_OPEN_TAG': /(?:<\?(php)?|<%)\s?(?!=)/,

            'T_OPEN_TAG_WITH_ECHO': /<[?%]=/,
            'T_OR_EQUAL': /\|=/,

            // Also defined as T_DOUBLE_COLON
            'T_PAAMAYIM_NEKUDOTAYIM': /::/i,

            'T_PLUS_EQUAL': /\+=/,
            'T_PRINT': /print\b/i,
            'T_PRIVATE': /private\b/i,
            'T_PUBLIC': /public\b/i,
            'T_PROTECTED': /protected\b/i,
            'T_REQUIRE': /require\b/i,
            'T_REQUIRE_ONCE': /require_once\b/i,
            'T_RETURN': /return\b/i,
            'T_SL': /<</,
            'T_SL_EQUAL': /<<=/,
            'T_SR': />>/,
            'T_SR_EQUAL': />>=/,
            'T_START_HEREDOC': /<<<(["']?)([\$a-z0-9_]+)\1\n?/,
            'T_STATIC': /static\b/i,
            'T_STRING': /(?![\$0-9])[\$a-z0-9_]+/i,
            'T_STRING_CAST': /\(\s*string\s*\)/i,
            'T_STRING_VARNAME': /(?![\$0-9])[\$a-z0-9_]+/,
            'T_SWITCH': /switch\b/i,
            'T_THROW': /throw\b/i,
            'T_TRAIT': /trait\b/i,
            'T_TRAIT_C': /__TRAIT__\b/i,
            'T_TRY': /try\b/i,
            'T_UNSET': /unset\b/i,
            'T_UNSET_CAST': /\(\s*unset\s*\)/i,
            'T_USE': /use\b/i,
            'T_VAR': /var\b/i,
            'T_VARIABLE': {what: /\$([a-z0-9_]+)/i, captureIndex: 1},
            'T_WHILE': /while\b/i,
            'T_WHITESPACE': /[\r\n\t ]+/,
            'T_XOR_EQUAL': /\^=/i,
            'T_YIELD': /yield\b/i,

            'N_ARRAY_INDEX': {
                components: 'N_EXPRESSION_LEVEL_2_A'
            },
            'N_ARRAY_LITERAL': {
                components: ['T_ARRAY', (/\(/), {name: 'elements', zeroOrMoreOf: [{oneOf: ['N_KEY_VALUE_PAIR', 'N_EXPRESSION']}, {what: (/(,|(?=\)))()/), captureIndex: 2}]}, (/\)/)]
            },
            'N_BOOLEAN': {
                components: {name: 'bool', what: (/true|false/i)}
            },
            'N_CLASS_STATEMENT': {
                components: ['T_CLASS', {name: 'className', what: 'N_STRING'}, (/\{/), {name: 'members', zeroOrMoreOf: {oneOf: ['N_PROPERTY_DEFINITION', 'N_METHOD_DEFINITION']}}, (/\}/)]
            },
            'N_COMMA_EXPRESSION': {
                components: {optionally: [{name: 'expressions', zeroOrMoreOf: ['N_EXPRESSION', {what: (/(,|(?=[;\)]))()/), captureIndex: 2}]}, (/(?=[;\)])/)]}
            },
            'N_COMPOUND_STATEMENT': {
                components: [(/\{/), {name: 'statements', zeroOrMoreOf: 'N_STATEMENT'}, (/\}/)]
            },
            'N_ECHO_STATEMENT': {
                components: ['T_ECHO', {name: 'expression', what: 'N_EXPRESSION'}, (/;/)]
            },
            'N_EMPTY_STATEMENT': {
                components: (/;/)
            },
            'N_EXPRESSION': {
                components: 'N_EXPRESSION_LEVEL_21'
            },

            /*
             * Operator precedence: see http://php.net/manual/en/language.operators.precedence.php
             */
            // Precedence level 0 (highest) - single terms and bracketed expressions
            'N_EXPRESSION_LEVEL_0': {
                components: [{oneOf: ['N_TERM', [(/\(/), 'N_EXPRESSION', (/\)/)]]}]
            },
            'N_EXPRESSION_LEVEL_1_A': {
                captureAs: 'N_NEW_EXPRESSION',
                components: {oneOf: [
                    [
                        {name: 'operator', what: 'T_NEW'},
                        {name: 'className', what: 'N_CLASS_REFERENCE'},
                        {optionally: [
                            (/\(/),
                            {name: 'args', zeroOrMoreOf: ['N_EXPRESSION', {what: (/(,|(?=\)))()/), captureIndex: 2}]},
                            (/\)/)
                        ]}
                    ],
                    {name: 'next', what: 'N_EXPRESSION_LEVEL_0'}
                ]},
                ifNoMatch: {component: 'operator', capture: 'next'}
            },
            'N_CLASS_REFERENCE': {
                components: {oneOf: [{name: 'path', what: [{optionally: 'T_NS_SEPARATOR'}, 'N_NAMESPACE']}, 'N_EXPRESSION_LEVEL_0']}
            },
            'N_EXPRESSION_LEVEL_1_B': {
                captureAs: 'N_METHOD_CALL',
                components: [
                    {name: 'object', what: 'N_EXPRESSION_LEVEL_1_A'},
                    {optionally: {
                        name: 'calls',
                        oneOrMoreOf: [
                            'T_OBJECT_OPERATOR',
                            {name: 'func', oneOf: ['N_STRING', 'N_VARIABLE']},
                            (/\(/),
                            {name: 'args', zeroOrMoreOf: ['N_EXPRESSION', {what: (/(,|(?=\)))()/), captureIndex: 2}]},
                            (/\)/)
                        ]
                    }}
                ],
                ifNoMatch: {component: 'calls', capture: 'object'}
            },
            'N_EXPRESSION_LEVEL_1_C': {
                captureAs: 'N_FUNCTION_CALL',
                components: {oneOf: [
                    [
                        {name: 'func', what: 'N_EXPRESSION_LEVEL_1_B'},
                        [
                            (/\(/),
                            {name: 'args', zeroOrMoreOf: ['N_EXPRESSION', {what: (/(,|(?=\)))()/), captureIndex: 2}]},
                            (/\)/)
                        ]
                    ],
                    {name: 'next', what: 'N_EXPRESSION_LEVEL_1_B'}
                ]},
                ifNoMatch: {component: 'func', capture: 'next'}
            },
            'N_EXPRESSION_LEVEL_1_D': {
                captureAs: 'N_UNARY_EXPRESSION',
                components: [{name: 'operator', optionally: 'T_CLONE'}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_1_C'}],
                ifNoMatch: {component: 'operator', capture: 'operand'},
                options: {prefix: true}
            },
            // Array index and object property must have identical precedence: with LL grammar we have to repeat
            'N_EXPRESSION_LEVEL_2_A': {
                captureAs: 'N_ARRAY_INDEX',
                components: [{name: 'array', what: 'N_EXPRESSION_LEVEL_1_D'}, {name: 'indices', zeroOrMoreOf: [(/\[/), {name: 'index', what: 'N_EXPRESSION'}, (/\]/)]}],
                ifNoMatch: {component: 'indices', capture: 'array'}
            },
            'N_EXPRESSION_LEVEL_2_B': {
                captureAs: 'N_OBJECT_PROPERTY',
                components: [{name: 'object', what: 'N_EXPRESSION_LEVEL_2_A'}, {name: 'properties', zeroOrMoreOf: ['T_OBJECT_OPERATOR', {name: 'property', what: 'N_MEMBER'}]}],
                ifNoMatch: {component: 'properties', capture: 'object'}
            },
            // Second occurrence of N_ARRAY_INDEX (see above)
            'N_EXPRESSION_LEVEL_2_C': {
                captureAs: 'N_ARRAY_INDEX',
                components: [{name: 'array', what: 'N_EXPRESSION_LEVEL_2_B'}, {name: 'indices', zeroOrMoreOf: [(/\[/), {name: 'index', what: 'N_EXPRESSION'}, (/\]/)]}],
                ifNoMatch: {component: 'indices', capture: 'array'}
            },
            'N_EXPRESSION_LEVEL_3': {
                oneOf: ['N_UNARY_PREFIX_EXPRESSION', 'N_UNARY_SUFFIX_EXPRESSION', 'N_EXPRESSION_LEVEL_2_C']
            },
            'N_UNARY_PREFIX_EXPRESSION': {
                captureAs: 'N_UNARY_EXPRESSION',
                components: [{name: 'operator', oneOf: ['T_INC', 'T_DEC', (/~/)]}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_2_C'}],
                ifNoMatch: {component: 'operator', capture: 'operand'},
                options: {prefix: true}
            },
            'N_UNARY_SUFFIX_EXPRESSION': {
                captureAs: 'N_UNARY_EXPRESSION',
                components: [{name: 'operand', what: 'N_EXPRESSION_LEVEL_2_C'}, {name: 'operator', oneOf: ['T_INC', 'T_DEC']}],
                ifNoMatch: {component: 'operator', capture: 'operand'},
                options: {prefix: false}
            },
            'N_EXPRESSION_LEVEL_4': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_3'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: 'T_INSTANCEOF'}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_3'}]}],
                ifNoMatch: {component: 'right', capture: 'left'}
            },
            'N_EXPRESSION_LEVEL_5': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'operator', optionally: (/!/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_4'}],
                ifNoMatch: {component: 'operator', capture: 'operand'}
            },
            'N_EXPRESSION_LEVEL_6': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_5'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', oneOf: [(/\*/), (/\//), (/%/)]}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_5'}]}],
                ifNoMatch: {component: 'right', capture: 'left'}
            },
            'N_EXPRESSION_LEVEL_7_A': {
                captureAs: 'N_UNARY_EXPRESSION',
                components: [{name: 'operator', optionally: (/([+-])(?!\1)/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_6'}],
                ifNoMatch: {component: 'operator', capture: 'operand'},
                options: {prefix: true}
            },
            'N_EXPRESSION_LEVEL_7_B': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_7_A'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', oneOf: [(/\+/), (/-/), (/\./)]}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_7_A'}]}],
                ifNoMatch: {component: 'right', capture: 'left'}
            },
            'N_EXPRESSION_LEVEL_8': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_7_B'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', oneOf: ['T_SL', 'T_SR']}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_7_B'}]}],
                ifNoMatch: {component: 'right', capture: 'left'}
            },
            'N_EXPRESSION_LEVEL_9': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_8'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', oneOf: ['T_IS_SMALLER_OR_EQUAL', (/</), 'T_IS_GREATER_OR_EQUAL', (/>/)]}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_8'}]}],
                ifNoMatch: {component: 'right', capture: 'left'}
            },
            'N_EXPRESSION_LEVEL_10': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_9'}, {name: 'right', wrapInArray: true, optionally: [{name: 'operator', oneOf: ['T_IS_IDENTICAL', 'T_IS_EQUAL', 'T_IS_NOT_IDENTICAL', 'T_IS_NOT_EQUAL']}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_9'}]}],
                ifNoMatch: {component: 'right', capture: 'left'}
            },
            'N_EXPRESSION_LEVEL_11': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_10'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: (/&/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_10'}]}],
                ifNoMatch: {component: 'right', capture: 'left'}
            },
            'N_EXPRESSION_LEVEL_12': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_11'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: (/\^/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_11'}]}],
                ifNoMatch: {component: 'right', capture: 'left'}
            },
            'N_EXPRESSION_LEVEL_13': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_12'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: (/\|/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_12'}]}],
                ifNoMatch: {component: 'right', capture: 'left'}
            },
            'N_EXPRESSION_LEVEL_14': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_13'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: (/&&/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_13'}]}],
                ifNoMatch: {component: 'right', capture: 'left'}
            },
            'N_EXPRESSION_LEVEL_15': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_14'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: (/\|\|/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_14'}]}],
                ifNoMatch: {component: 'right', capture: 'left'}
            },
            'N_EXPRESSION_LEVEL_16': {
                captureAs: 'N_TERNARY',
                components: [{name: 'condition', what: 'N_EXPRESSION_LEVEL_15'}, {name: 'options', zeroOrMoreOf: [(/\?/), {name: 'consequent', what: 'N_EXPRESSION_LEVEL_15'}, (/:/), {name: 'alternate', what: 'N_EXPRESSION_LEVEL_15'}]}],
                ifNoMatch: {component: 'options', capture: 'condition'}
            },
            'N_EXPRESSION_LEVEL_17_A': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_16'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: (/=/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_16'}]}],
                ifNoMatch: {component: 'right', capture: 'left'}
            },
            'N_EXPRESSION_LEVEL_17_B': {
                captureAs: 'N_PRINT_EXPRESSION',
                components: {oneOf: [
                    [
                        'T_PRINT',
                        {name: 'operand', what: 'N_EXPRESSION_LEVEL_17_A'},
                    ],
                    {name: 'next', what: 'N_EXPRESSION_LEVEL_17_A'}
                ]},
                ifNoMatch: {component: 'operand', capture: 'next'}
            },
            'N_EXPRESSION_LEVEL_18': {
                captureAs: 'N_EXPRESSION',
                components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_17_B'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: 'T_LOGICAL_AND'}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_17_B'}]}],
                ifNoMatch: {component: 'right', capture: 'left'}
            },
            'N_EXPRESSION_LEVEL_19': {
                components: 'N_EXPRESSION_LEVEL_18'
            },
            'N_EXPRESSION_LEVEL_20': {
                components: 'N_EXPRESSION_LEVEL_19'
            },
            'N_EXPRESSION_LEVEL_21': {
                components: 'N_EXPRESSION_LEVEL_20'
            },
            'N_EXPRESSION_STATEMENT': {
                components: [{name: 'expression', what: 'N_EXPRESSION'}, (/;/)]
            },
            'N_FLOAT': {
                components: {name: 'number', what: 'T_DNUMBER'}
            },
            'N_FOR_STATEMENT': {
                components: ['T_FOR', (/\(/), {name: 'initializer', what: 'N_COMMA_EXPRESSION'}, (/;/), {name: 'condition', what: 'N_COMMA_EXPRESSION'}, (/;/), {name: 'update', what: 'N_COMMA_EXPRESSION'}, (/\)/), {name: 'body', what: 'N_STATEMENT'}]
            },
            'N_FOREACH_STATEMENT': {
                components: ['T_FOREACH', (/\(/), {name: 'array', oneOf: ['N_ARRAY_INDEX', 'N_VARIABLE']}, 'T_AS', {optionally: [{name: 'key', oneOf: ['N_ARRAY_INDEX', 'N_VARIABLE']}, 'T_DOUBLE_ARROW']}, {name: 'value', oneOf: ['N_ARRAY_INDEX', 'N_VARIABLE']}, (/\)/), (/\{/), {name: 'statements', zeroOrMoreOf: 'N_STATEMENT'}, (/\}/)]
            },
            'N_FUNCTION_STATEMENT': {
                components: ['T_FUNCTION', {name: 'func', what: 'T_STRING'}, (/\(/), {name: 'args', zeroOrMoreOf: ['N_VARIABLE', {what: (/(,|(?=\)))()/), captureIndex: 2}]}, (/\)/), (/\{/), {name: 'statements', zeroOrMoreOf: 'N_STATEMENT'}, (/\}/)]
            },
            'N_GOTO_STATEMENT': {
                components: ['T_GOTO', {name: 'label', what: 'T_STRING'}, (/;/)]
            },
            'N_IF_STATEMENT': {
                components: ['T_IF', (/\(/), {name: 'condition', what: 'N_EXPRESSION'}, (/\)/), {name: 'consequentStatement', what: 'N_STATEMENT'}, {optionally: [(/else(\b|(?=if\b))/), {name: 'alternateStatement', what: 'N_STATEMENT'}]}]
            },
            'N_IGNORE': {
                components: {oneOrMoreOf: {oneOf: ['T_WHITESPACE', 'T_COMMENT', 'T_DOC_COMMENT']}}
            },
            'N_INLINE_HTML_STATEMENT': [{oneOf: ['T_CLOSE_TAG', '<BOF>']}, {name: 'html', what: 'T_INLINE_HTML'}, {oneOf: ['T_OPEN_TAG', '<EOF>']}],
            'N_INTEGER': {
                components: {name: 'number', what: 'T_LNUMBER'}
            },
            'N_ISSET': {
                components: ['T_ISSET', (/\(/), {name: 'variables', zeroOrMoreOf: ['N_EXPRESSION', {what: (/(,|(?=\)))()/), captureIndex: 2}]}, (/\)/)]
            },
            'N_KEY_VALUE_PAIR': {
                components: [{name: 'key', what: 'N_EXPRESSION'}, 'T_DOUBLE_ARROW', {name: 'value', what: 'N_EXPRESSION'}]
            },
            'N_LABEL_STATEMENT': {
                components: [{name: 'label', what: 'T_STRING'}, (/:/)]
            },
            'N_LIST': {
                components: ['T_LIST', (/\(/), {name: 'elements', zeroOrMoreOf: {oneOf: [[{oneOf: ['N_VARIABLE', 'N_ARRAY_INDEX']}, {what: (/(,|(?=\)))()/), captureIndex: 2}], 'N_VOID']}}, (/\)/)]
            },
            'N_MEMBER': {
                components: {oneOf: ['N_STRING', 'N_VARIABLE', [(/\{/), 'N_EXPRESSION', (/\}/)]]}
            },
            'N_METHOD_DEFINITION': {
                components: [{name: 'visibility', oneOf: ['T_PUBLIC', 'T_PRIVATE', 'T_PROTECTED']}, {name: 'type', optionally: 'T_STATIC'}, 'T_FUNCTION', {name: 'func', what: 'T_STRING'}, (/\(/), {name: 'args', zeroOrMoreOf: ['N_VARIABLE', {what: (/(,|(?=\)))()/), captureIndex: 2}]}, (/\)/), (/\{/), {name: 'statements', zeroOrMoreOf: 'N_STATEMENT'}, (/\}/)]
            },
            'N_NAMESPACE': {
                components: ['T_STRING', {zeroOrMoreOf: ['T_NS_SEPARATOR', 'T_STRING']}]
            },
            'N_NAMESPACE_STATEMENT': {
                components: ['T_NAMESPACE', {name: 'namespace', what: 'N_NAMESPACE'}, (/;/), {name: 'statements', zeroOrMoreOf: 'N_NAMESPACE_SCOPED_STATEMENT'}]
            },
            'N_PROGRAM': {
                components: [{optionally: 'T_OPEN_TAG'}, {name: 'statements', zeroOrMoreOf: 'N_STATEMENT'}, {oneOf: ['T_CLOSE_TAG', {what: '<EOF>'}]}]
            },
            'N_PROPERTY_DEFINITION': {
                components: [{name: 'visibility', oneOf: ['T_PUBLIC', 'T_PRIVATE', 'T_PROTECTED']}, {name: 'type', optionally: 'T_STATIC'}, {name: 'variable', what: 'N_VARIABLE'}, {optionally: [(/=/), {name: 'value', what: 'N_TERM'}]}, (/;/)]
            },
            'N_RETURN_STATEMENT': {
                components: ['T_RETURN', {name: 'expression', optionally: 'N_EXPRESSION'}, (/;/)]
            },
            'N_STATEMENT': {
                components: {oneOf: ['N_NAMESPACE_SCOPED_STATEMENT', 'N_NAMESPACE_STATEMENT']}
            },
            'N_NAMESPACE_SCOPED_STATEMENT': {
                components: {oneOf: ['N_COMPOUND_STATEMENT', 'N_RETURN_STATEMENT', 'N_INLINE_HTML_STATEMENT', 'N_EMPTY_STATEMENT', 'N_ECHO_STATEMENT', 'N_EXPRESSION_STATEMENT', 'N_FUNCTION_STATEMENT', 'N_IF_STATEMENT', 'N_FOREACH_STATEMENT', 'N_FOR_STATEMENT', 'N_WHILE_STATEMENT', 'N_CLASS_STATEMENT', 'N_LABEL_STATEMENT', 'N_GOTO_STATEMENT']}
            },
            'N_STRING': {
                components: {name: 'string', what: 'T_STRING'}
            },
            'N_STRING_EXPRESSION': {
                components: [(/"/), {name: 'parts', oneOrMoreOf: {oneOf: ['N_STRING_VARIABLE', 'N_STRING_VARIABLE_EXPRESSION', 'N_STRING_TEXT']}}, (/"/)]
            },
            'N_STRING_LITERAL': {
                components: {oneOf: [{name: 'string', what: 'T_CONSTANT_ENCAPSED_STRING'}, 'N_STRING_EXPRESSION']}
            },
            'N_STRING_TEXT': {
                captureAs: 'N_STRING_LITERAL',
                components: {name: 'string', what: (/(?:[^\\"\$]|\\[\s\S]|\$(?=\$))+/), ignoreWhitespace: false, replace: stringEscapeReplacements}
            },
            'N_STRING_VARIABLE': {
                captureAs: 'N_VARIABLE',
                components: [
                    {oneOf: [
                        {name: 'variable', what: 'T_VARIABLE'},
                        {name: 'variable', what: (/\$\{([a-z0-9_]+)\}/i), captureIndex: 1}
                    ]}
                ]
            },
            'N_STRING_VARIABLE_EXPRESSION': {
                captureAs: 'N_VARIABLE_EXPRESSION',
                components: [
                    {oneOf: [
                        {name: 'expression', what: [(/\$\{(?=\$)/), 'N_VARIABLE', (/\}/)]}
                    ]}
                ]
            },
            'N_TERM': {
                components: {oneOf: ['N_VARIABLE', 'N_FLOAT', 'N_INTEGER', 'N_BOOLEAN', 'N_STRING_LITERAL', 'N_ARRAY_LITERAL', 'N_LIST', 'N_ISSET', 'N_STRING']}
            },
            'N_VARIABLE': {
                components: [
                    {optionally: {name: 'reference', what: (/&/)}},
                    {oneOf: [
                        {name: 'variable', what: 'T_VARIABLE'},
                        {name: 'variable', what: (/\$\{([a-z0-9_]+)\}/i), captureIndex: 1}
                    ]}
                ]
            },
            'N_VOID': {
                components: {name: 'value', what: (/,()/), captureIndex: 1}
            },
            'N_WHILE_STATEMENT': {
                components: ['T_WHILE', (/\(/), {name: 'condition', what: 'N_EXPRESSION'}, (/\)/), (/\{/), {name: 'statements', zeroOrMoreOf: 'N_STATEMENT'}, (/\}/)]
            }
        },
        start: 'N_PROGRAM'
    };
});
