<?php if (!defined('PmWiki')) exit();
/**
  PauseGIFs: Deanimate animated GIFs for PmWiki
  Written by (c) Petko Yotov 2020-2023   www.pmwiki.org/support

  This text is written for PmWiki; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published
  by the Free Software Foundation; either version 3 of the License, or
  (at your option) any later version. See pmwiki.php for full details
  and lack of warranty.
*/

$RecipeInfo['PauseGIFs']['Version'] = '20230212';

SDV($PauseGIFsExt, '.ani.gif');

SDV($UploadVerifyFunction, 'PauseGIFsUploadVerifyFunction');


$ModuleHeaderFmt[] = array("$ModuleDirUrl/pausegif.js", 'data-ext' => $PauseGIFsExt);

function PauseGIFsUploadVerifyFunction($pagename,$uploadfile,&$filepath,&$upname) {
  global $PauseGIFsExt, $DefaultUploadVerifyFunction;
  SDV($DefaultUploadVerifyFunction, 'UploadVerifyBasic');
  
  $rx = '/^(.*)(\\.gif)$/i';
  $result = $DefaultUploadVerifyFunction($pagename,$uploadfile,$filepath,$upname);
  if($result || $PauseGIFsExt == '.gif' || !preg_match($rx, $filepath, $m)) 
    return $result;
  $tmppath = escapeshellarg($uploadfile['tmp_name']);
  $cmd = "identify -format '%n\\n' $tmppath";
  $frames = intval(exec($cmd));
  if($frames > 1) {
    $filepath = "{$m[1]}$PauseGIFsExt";
    $upname = preg_replace($rx, "$1$PauseGIFsExt", $upname);
  }
  return $result;
}

