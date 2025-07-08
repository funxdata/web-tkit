use std::path::Path;

use swc_core::common::{
    comments::SingleThreadedComments,
    errors::{EmitterWriter, Handler},
    sync::Lrc,
    Globals, Mark, SourceMap, GLOBALS,
};
use swc_core::ecma::codegen::to_code_default;
use swc_core::ecma::parser::{lexer::Lexer, Parser, StringInput, Syntax, TsSyntax};
use swc_core::ecma::transforms::base::{fixer::fixer, hygiene::hygiene, resolver};
use swc_core::ecma::transforms::typescript::strip;

fn main() {
    let cm: Lrc<SourceMap> = Default::default();
    let handler = Handler::with_emitter(
        true,  // can_emit_warnings
        false, // treat_err_as_bug
        Box::new(EmitterWriter::new(
            Box::new(std::io::stderr()),
            Some(cm.clone()),
            false,
            false,
        )),
    );

    let relative_path = Path::new("../src/app.ts");

    let absolute_path = std::fs::canonicalize(relative_path).unwrap();
    println!("url_path{:?}",absolute_path);
    let fm = cm.load_file(&absolute_path).expect("failed to load input.ts");

    let comments = SingleThreadedComments::default();

    let lexer = Lexer::new(
        Syntax::Typescript(TsSyntax {
            tsx: absolute_path.extension().map_or(false, |ext| ext == "tsx"),
            ..Default::default()
        }),
        Default::default(),
        StringInput::from(&*fm),
        Some(&comments),
    );

    let mut parser = Parser::new_from(lexer);

    for e in parser.take_errors() {
        e.into_diagnostic(&handler).emit();
    }

    let module = parser
        .parse_program()
        .map_err(|e| e.into_diagnostic(&handler).emit())
        .expect("failed to parse module.");

    let globals = Globals::new();
    GLOBALS.set(&globals, || {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let module = module.apply(resolver(unresolved_mark, top_level_mark, true));
        let module = module.apply(strip(unresolved_mark, top_level_mark));
        let module = module.apply(hygiene());
        let program = module.apply(fixer(Some(&comments)));

        println!("{}", to_code_default(cm, Some(&comments), &program));
    })
}
