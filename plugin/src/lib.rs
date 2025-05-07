
use std::ffi::{CString,CStr};
use std::os::raw::c_char;
use std::fs;

#[unsafe(no_mangle)]
pub extern "C" fn sass_to_css_view(input_src: *const c_char) -> *const c_char {
    let c_str = unsafe { CStr::from_ptr(input_src) };
    // let input_str = c_str.to_str().unwrap_or("");
    let input_str = c_str.to_str().unwrap_or("");
    let sass_content = fs::read_to_string(input_str).unwrap();
    // 解析 CSS
    let sass_info_res = grass::from_string(sass_content, &grass::Options::default());
    if sass_info_res.is_err()  {
        eprintln!("sass_info_res is err{:?}",sass_info_res.err());
        return std::ptr::null();
    }
    let sass_info = sass_info_res.unwrap();
    // return output.code;
    let c_string = CString::new(sass_info).unwrap();
    let ptr = c_string.as_ptr();
    // ⚠️ 手动泄露字符串，防止 Rust 自动释放
    std::mem::forget(c_string);
    ptr
}


// pub extern "C" fn sass_or_less_to_css_pack(input_src: *const c_char) -> *const c_char {
//     let c_str = unsafe { CStr::from_ptr(input) };
//     // let input_str = c_str.to_str().unwrap_or("");
//     let input_str = c_str.to_str().unwrap_or("");
//     println!("Hello, {}!", input_str);
//     let css = r#"
//     a {
//             display: flex;
//         }
//     "#;

//     // 解析 CSS
//     let mut stylesheet = StyleSheet::parse(
//         css,
//         ParserOptions {
//             filename: "example.css".into(),
//             ..Default::default()
//         },
//     ).expect("Failed to parse CSS");

//     // 压缩
//     stylesheet.minify(Default::default()).unwrap();

//     // 输出为字符串
//     let output = stylesheet.to_css(PrinterOptions::default()).unwrap();

//     println!("Compressed CSS:\n{}", output.code);
//     // return output.code;

//     let c_string = CString::new(output.code).unwrap();
//     let ptr = c_string.as_ptr();

//     // ⚠️ 手动泄露字符串，防止 Rust 自动释放
//     std::mem::forget(c_string);

//     ptr
// }

// #[unsafe(no_mangle)]
// pub extern "C" fn ts_to_js_view(input_src: *const c_char) -> *const c_char {
//     let c_str = unsafe { CStr::from_ptr(input_src) };
//     // let input_str = c_str.to_str().unwrap_or("");
//     let input_str = c_str.to_str().unwrap_or("");
//     let typescript_content = fs::read_to_string(input_str).unwrap();

//     let parser = Parser::new_from(&typescript_content);
//     let module = parse_file(&parser, Syntax::TypeScript).unwrap();

//     // 编译处理
//     let globals = Globals::new();
//     let mark = Mark::fresh(Mark::root());

//     let transformed = module;  // 在此可以应用更多转换
//     let emitter = Emitter::new(transformed);

//     // 解析 CSS
//     let sass_info_res = grass::from_string(sass_content, &grass::Options::default());
//     if sass_info_res.is_err()  {
//         eprintln!("sass_info_res is err{:?}",sass_info_res.err());
//         return std::ptr::null();
//     }
//     let sass_info = sass_info_res.unwrap();
//     // return output.code;
//     let c_string = CString::new(sass_info).unwrap();
//     let ptr = c_string.as_ptr();
//     // ⚠️ 手动泄露字符串，防止 Rust 自动释放
//     std::mem::forget(c_string);
//     ptr
// }