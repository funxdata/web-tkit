
use std::ffi::{CString,CStr};
use std::os::raw::c_char;
use std::fs;

#[unsafe(no_mangle)]
pub(crate) fn sass_to_css_view(input_src: *const c_char) -> *const c_char {
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
