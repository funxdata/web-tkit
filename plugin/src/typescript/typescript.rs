// use std::{
//     ffi::{CStr, CString},
//     os::raw::c_char,
//     sync::Arc,
// };

// use swc_core::{
//     common::{
//         errors::{Handler, EmitterWriter},
//         FileName, Globals, SourceMap,
//     },
//     ecma::ast::Module,
//     ecma::codegen::{text_writer::JsWriter, Emitter},
//     ecma::parser::{lexer::Lexer, Parser, StringInput, Syntax, TsConfig},
//     ecma::transforms::base::resolver,
//     ecma::transforms::typescript::strip,
//     ecma::visit::FoldWith,
// };

// #[unsafe(no_mangle)]
// pub unsafe extern "C" fn ts_code_to_js(ts_ptr: *const c_char) -> *const c_char {
//     let ts_code = match CStr::from_ptr(ts_ptr).to_str() {
//         Ok(s) => s,
//         Err(_) => return std::ptr::null(),
//     };

//     let cm: Arc<SourceMap> = Default::default();

//     let writer = Box::new(EmitterWriter::new(
//         Box::new(std::io::stderr()),
//         Some(cm.clone()),
//         false, // 是否启用颜色，这里 false 禁用颜色
//         false,
//     ));
//     let handler = Handler::with_emitter(writer);

//     let globals = Globals::new();

//     let result = swc_core::common::GLOBALS.set(&globals, || {
//         let fm = cm.new_source_file(FileName::Custom("input.ts".into()), ts_code.into());

//         let lexer = Lexer::new(
//             Syntax::Typescript(TsConfig {
//                 tsx: false,
//                 decorators: false,
//                 dts: false,
//                 dynamic_import: true,
//                 ..Default::default()
//             }),
//             Default::default(),
//             StringInput::from(&*fm),
//             None,
//         );

//         let mut parser = Parser::new_from(lexer);
//         let mut module: Module = match parser.parse_module() {
//             Ok(m) => m,
//             Err(e) => {
//                 e.into_diagnostic(&handler).emit();
//                 return None;
//             }
//         };

//         // 处理 import/export 等符号解析
//         let top_level_mark = swc_core::common::Mark::fresh(swc_core::common::Mark::root());
//         module = module.fold_with(&mut resolver(top_level_mark, top_level_mark, false));
//         // 去掉 TypeScript 类型注解
//         module = module.fold_with(&mut strip(top_level_mark));

//         let mut buf = vec![];
//         {
//             let mut emitter = Emitter {
//                 cfg: Default::default(),
//                 cm: cm.clone(),
//                 comments: None,
//                 wr: JsWriter::new(cm.clone(), "\n", &mut buf, None),
//             };

//             if emitter.emit_module(&module).is_err() {
//                 return None;
//             }
//         }

//         Some(String::from_utf8(buf).ok()?)
//     });

//     match result {
//         Some(js_code) => match CString::new(js_code) {
//             Ok(c_string) => {
//                 let ptr = c_string.as_ptr();
//                 std::mem::forget(c_string);
//                 ptr
//             }
//             Err(_) => std::ptr::null(),
//         },
//         None => std::ptr::null(),
//     }
// }

// #[no_mangle]
// pub extern "C" fn free_js(ptr: *mut c_char) {
//     if !ptr.is_null() {
//         unsafe {
//             let _ = CString::from_raw(ptr);
//         }
//     }
// }
